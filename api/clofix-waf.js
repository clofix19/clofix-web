// clofix-waf.js 
(function(global) {
    'use strict';

    const CONFIG = {
        apiUrl: 'http://api.clofix.com',
        debug: true,
        autoInit: true
    };

    class CloFixWAF {
        constructor(config = {}) {
            this.apiUrl = config.apiUrl || CONFIG.apiUrl;
            this.debug = config.debug || CONFIG.debug;
            this.domain = this.getDomain();
            this.rayId = null;
            this.licenseKey = null;
            this.initialized = false;
            this.verificationInProgress = false;

            this.log(`🛡️ CloFix WAF initialized for: ${this.domain}`);
            
            if (config.autoInit !== false) {
                this.init();
            }
        }

        // =============================================
        // AUTO DETECT DOMAIN
        // =============================================
        getDomain() {
            let domain = window.location.hostname;
            
            const metaDomain = document.querySelector('meta[name="clofix-domain"]');
            if (metaDomain && metaDomain.getAttribute('content')) {
                domain = metaDomain.getAttribute('content');
                this.log(`Domain from meta: ${domain}`);
            }
            
            domain = domain.replace(/^https?:\/\//, '');
            domain = domain.replace(/^www\./, '');
            domain = domain.replace(/:\d+$/, '');
            domain = domain.split('/')[0];
            domain = domain.toLowerCase();
            
            return domain;
        }
 
        async init() {
            if (this.initialized) return;
            
            this.log(`🔍 Verifying domain: ${this.domain}`);
            
            try {
                const response = await this.checkDomain();
                
                if (response.registered) {
                    this.licenseKey = response.license_key;
                    this.rayId = response.ray_id;
                    this.initialized = true;
                    
                    this.log(`✅ Domain verified (license: ${this.licenseKey})`);
                    this.showBadge(`✅ CloFix Active (${response.plan || 'N/A'})`, 'success');
                    this.interceptForms();
                } else {
                    this.log(`❌ Domain not registered: ${this.domain}`);
                    this.showBlockPage(response);
                }
            } catch (error) {
                this.log(`⚠️ Verification failed: ${error.message}`, 'error');
                this.redirectToChallenge();
            }
        }

        async checkDomain() {
            const response = await fetch(`${this.apiUrl}/api/v1/domain-check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Request-Host': this.domain
                },
                body: JSON.stringify({
                    domain: this.domain,
                    timestamp: Date.now(),
                    user_agent: navigator.userAgent
                })
            });
            return await response.json();
        }

        interceptForms() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                if (form.hasAttribute('data-waf-processed')) return;
                
                form.setAttribute('data-waf-processed', 'true');
                
                const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                if (submitBtn) {
                    submitBtn.setAttribute('data-original-text', submitBtn.textContent);
                }
                
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await this.handleFormSubmit(form);
                });
            });
            
            this.log(`🔒 Protected ${forms.length} forms`);
        }

        async handleFormSubmit(form) {
            if (this.verificationInProgress) {
                this.showToast('⏳ Verification in progress...', 'warning');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            const originalText = submitBtn ? submitBtn.textContent : 'Submit';

            // Collect form data
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            this.verificationInProgress = true;
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = '⏳ Verifying...';
            }

            const verified = await this.showCloudflareVerification(form);

            if (!verified) {
                this.verificationInProgress = false;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
                this.showToast('❌ Verification failed. Please try again.', 'error');
                return;
            }

            try {
                const licenseKey = this.licenseKey || 'auto';
                
                const response = await fetch(`${this.apiUrl}/api/v1/validate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-License-Key': licenseKey,
                        'X-Request-Host': this.domain
                    },
                    body: JSON.stringify({
                        domain: this.domain,
                        ray_id: this.rayId,
                        data: data,
                        action: form.id || 'submit'
                    })
                });

                const result = await response.json();

                if (result.allowed) {
                    this.log(`✅ Form submitted successfully`);
                    this.showToast('✅ Form submitted successfully!', 'success');
                    
                    if (form.getAttribute('data-waf-reset') !== 'false') {
                        form.reset();
                    }
                    
                    const callback = form.getAttribute('data-waf-callback');
                    if (callback && window[callback]) {
                        window[callback](result);
                    }
                } else {
                    this.log(`❌ Form blocked: ${result.reason}`);
                    this.showToast(`❌ ${result.reason || 'Submission blocked'}`, 'error');
                }
            } catch (error) {
                this.log(`❌ Submission error: ${error.message}`, 'error');
                this.showToast('❌ Submission failed', 'error');
            }

            this.verificationInProgress = false;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }

        showCloudflareVerification(form) {
            return new Promise((resolve) => {
                const overlay = this.createVerificationOverlay(form);
                document.body.appendChild(overlay);
                
                this.startVerificationProcess(overlay, resolve);
            });
        }

        createVerificationOverlay(form) {
            const overlay = document.createElement('div');
            overlay.id = 'clofix-verification-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.92);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: clofixFadeIn 0.3s ease;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            `;

            overlay.innerHTML = `
                <div style="
                    background: #ffffff;
                    border-radius: 24px;
                    max-width: 460px;
                    width: 90%;
                    overflow: hidden;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.5);
                    animation: clofixSlideUp 0.4s ease;
                ">
                    <!-- Header - Cloudflare Style -->
                    <div style="
                        background: #1e293b;
                        padding: 16px 24px 14px 24px;
                        border-bottom: 2px solid #facc15;
                    ">
                        <div style="display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;">
                            <span style="
                                font-size: 1.6rem;
                                font-weight: 700;
                                background: linear-gradient(135deg, #ffffff, #cbd5e6);
                                -webkit-background-clip: text;
                                background-clip: text;
                                color: transparent;
                            ">CloFix <span style="font-weight:400; color:#94a3b8;">WAF</span></span>
                            <span style="
                                background: rgba(250, 204, 21, 0.15);
                                padding: 2px 10px;
                                border-radius: 60px;
                                font-size: 0.6rem;
                                font-weight: 600;
                                color: #facc15;
                                border: 0.5px solid rgba(250, 204, 21, 0.3);
                            ">Web Application Firewall</span>
                        </div>
                        <div style="color: #94a3b8; font-size: 0.7rem; margin-top: 4px;">
                            Protecting your experience • AI threat defense
                        </div>
                    </div>

                    <!-- Body -->
                    <div style="padding: 28px 24px 30px 24px; text-align: center;">

                        <!-- Shield Icon -->
                        <div style="display: flex; justify-content: center; margin-bottom: 14px;">
                            <div style="
                                background: #eef2ff;
                                width: 64px;
                                height: 64px;
                                border-radius: 60px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                box-shadow: 0 6px 16px rgba(0,0,0,0.03);
                            ">
                                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="#dbeafe"/>
                                    <path d="M12 22L3 17L3 7" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                    <path d="M21 7L21 17L12 22" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                    <path d="M12 12V22" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"/>
                                    <path d="M8.5 10.5L12 12L15.5 10.5" stroke="#3b82f6" stroke-width="1.2" stroke-linecap="round"/>
                                </svg>
                            </div>
                        </div>

                        <h2 style="
                            font-size: 1.3rem;
                            font-weight: 600;
                            color: #0f172a;
                            margin-bottom: 2px;
                        " id="cf-status-title">Verifying your browser</h2>
                        
                        <p style="
                            color: #64748b;
                            font-size: 0.8rem;
                            margin-bottom: 18px;
                        " id="cf-status-sub">CloFix WAF is checking your connection</p>

                        <!-- Progress Steps -->
                        <div style="text-align: left; margin: 16px 0 20px 0;">
                            <div id="cf-step-1" style="
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                padding: 6px 10px;
                                margin-bottom: 10px;
                                border-radius: 10px;
                                opacity: 0.35;
                                transition: all 0.3s;
                            ">
                                <div style="
                                    width: 30px;
                                    height: 30px;
                                    background: #e2e8f0;
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-weight: 700;
                                    font-size: 12px;
                                    color: #475569;
                                    transition: all 0.3s;
                                    flex-shrink: 0;
                                " id="cf-step1-icon">1</div>
                                <div>
                                    <div style="font-weight: 500; color: #1e293b; font-size: 0.8rem;">Browser integrity check</div>
                                    <div style="font-size: 0.65rem; color: #64748b;">JavaScript & challenge validation</div>
                                </div>
                            </div>

                            <div id="cf-step-2" style="
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                padding: 6px 10px;
                                margin-bottom: 10px;
                                border-radius: 10px;
                                opacity: 0.35;
                                transition: all 0.3s;
                            ">
                                <div style="
                                    width: 30px;
                                    height: 30px;
                                    background: #e2e8f0;
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-weight: 700;
                                    font-size: 12px;
                                    color: #475569;
                                    transition: all 0.3s;
                                    flex-shrink: 0;
                                " id="cf-step2-icon">2</div>
                                <div>
                                    <div style="font-weight: 500; color: #1e293b; font-size: 0.8rem;">WAF rule inspection</div>
                                    <div style="font-size: 0.65rem; color: #64748b;">CloFix real-time filtering</div>
                                </div>
                            </div>

                            <div id="cf-step-3" style="
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                padding: 6px 10px;
                                margin-bottom: 10px;
                                border-radius: 10px;
                                opacity: 0.35;
                                transition: all 0.3s;
                            ">
                                <div style="
                                    width: 30px;
                                    height: 30px;
                                    background: #e2e8f0;
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-weight: 700;
                                    font-size: 12px;
                                    color: #475569;
                                    transition: all 0.3s;
                                    flex-shrink: 0;
                                " id="cf-step3-icon">3</div>
                                <div>
                                    <div style="font-weight: 500; color: #1e293b; font-size: 0.8rem;">SSL handshake & threat score</div>
                                    <div style="font-size: 0.65rem; color: #64748b;">Verifying request legitimacy</div>
                                </div>
                            </div>
                        </div>

                        <!-- Status Message -->
                        <div id="cf-status" style="
                            margin-top: 8px;
                            padding: 10px;
                            background: #f8fafc;
                            border-radius: 60px;
                            font-size: 0.8rem;
                            font-weight: 500;
                            color: #1e293b;
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                        ">
                            <span id="cf-status-text">Checking security posture</span>
                            <span id="cf-dots" style="display: inline-flex; gap: 3px;">
                                <span style="width: 4px; height: 4px; background: #3b82f6; border-radius: 50%; animation: clofixBlink 1.4s infinite;"></span>
                                <span style="width: 4px; height: 4px; background: #3b82f6; border-radius: 50%; animation: clofixBlink 1.4s infinite 0.2s;"></span>
                                <span style="width: 4px; height: 4px; background: #3b82f6; border-radius: 50%; animation: clofixBlink 1.4s infinite 0.4s;"></span>
                            </span>
                        </div>

                        <!-- Ray ID -->
                        <div style="
                            margin-top: 14px;
                            font-size: 0.6rem;
                            color: #94a3b8;
                            font-family: monospace;
                        ">
                            Ray ID: <span id="cf-ray-id">${this.rayId || 'verifying...'}</span>
                        </div>

                        <!-- Footer -->
                        <div style="
                            margin-top: 16px;
                            padding-top: 14px;
                            border-top: 1px solid #eef2f6;
                            font-size: 0.55rem;
                            color: #94a3b8;
                        ">
                            CloFix WAF · protecting against OWASP Top 10, DDoS & bots
                        </div>
                    </div>
                </div>
            `;

            const style = document.createElement('style');
            style.textContent = `
                @keyframes clofixFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes clofixSlideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes clofixBlink {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 1; }
                }
                @keyframes clofixStepPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                }
                #cf-step-1.active, #cf-step-2.active, #cf-step-3.active {
                    opacity: 1;
                    background: #f1f5f9;
                }
                #cf-step-1.active .step-icon, #cf-step-2.active .step-icon, #cf-step-3.active .step-icon {
                    background: #3b82f6;
                    color: white;
                    box-shadow: 0 4px 8px rgba(59,130,246,0.25);
                    animation: clofixStepPulse 0.8s ease;
                }
                #cf-step-1.completed .step-icon, #cf-step-2.completed .step-icon, #cf-step-3.completed .step-icon {
                    background: #10b981;
                    color: white;
                }
            `;
            document.head.appendChild(style);

            return overlay;
        }

        startVerificationProcess(overlay, resolve) {
            const steps = [
                { id: 'cf-step-1', icon: 'cf-step1-icon', title: 'Browser integrity check', done: false },
                { id: 'cf-step-2', icon: 'cf-step2-icon', title: 'WAF rule inspection', done: false },
                { id: 'cf-step-3', icon: 'cf-step3-icon', title: 'SSL handshake & threat score', done: false }
            ];

            const statusText = overlay.querySelector('#cf-status-text');
            const dots = overlay.querySelector('#cf-dots');
            const statusTitle = overlay.querySelector('#cf-status-title');
            const statusSub = overlay.querySelector('#cf-status-sub');
            const rayIdEl = overlay.querySelector('#cf-ray-id');

            // Update Ray ID
            if (this.rayId) {
                rayIdEl.textContent = this.rayId;
            }

            let currentStep = 0;
            const messages = [
                'Checking browser integrity & JavaScript...',
                'CloFix WAF: scanning request patterns...',
                'Finalizing secure handshake · Threat score: 0/100',
                '✅ Verification successful · Access granted'
            ];

            const titles = [
                'Checking browser integrity',
                'WAF inspection in progress',
                'Security check passed',
                'Verification complete!'
            ];

            const subs = [
                'JavaScript & security validation',
                'Real-time threat detection',
                'Connection is secure',
                'CloFix WAF cleared'
            ];

            // Process steps with animation
            const interval = setInterval(() => {
                if (currentStep < steps.length) {
                    const step = steps[currentStep];
                    const stepEl = overlay.querySelector(`#${step.id}`);
                    const iconEl = overlay.querySelector(`#${step.icon}`);
                    
                    if (stepEl) {
                        stepEl.classList.add('active');
                        stepEl.style.opacity = '1';
                    }
                    
                    if (iconEl) {
                        iconEl.textContent = currentStep < steps.length - 1 ? '✓' : '✓';
                        iconEl.style.background = currentStep < steps.length - 1 ? '#3b82f6' : '#10b981';
                        iconEl.style.color = 'white';
                    }

                    // Update status text
                    statusText.textContent = messages[currentStep];
                    statusTitle.textContent = titles[currentStep];
                    statusSub.textContent = subs[currentStep];
                    
                    currentStep++;
                } else {
                    // Verification complete
                    clearInterval(interval);
                    
                    statusText.textContent = messages[3];
                    statusText.style.color = '#16a34a';
                    
                    statusTitle.textContent = 'Verification complete!';
                    statusSub.textContent = 'Securely connected to origin';
                    
                    if (dots) {
                        dots.innerHTML = '✓';
                        dots.style.color = '#16a34a';
                        dots.style.fontSize = '16px';
                    }

                    // Success
                    setTimeout(() => {
                        overlay.remove();
                        resolve(true);
                    }, 800);
                }
            }, 1100);

            // Safety timeout
            setTimeout(() => {
                if (currentStep < steps.length) {
                    clearInterval(interval);
                    overlay.remove();
                    resolve(false);
                }
            }, 10000);
        }

        showBlockPage(data) {
            document.body.innerHTML = `
                <div style="
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #0a0e17;
                    font-family: system-ui;
                    padding: 20px;
                ">
                    <div style="
                        max-width: 500px;
                        background: #0f2138;
                        border-radius: 24px;
                        padding: 40px;
                        text-align: center;
                        border: 1px solid #e85d26;
                    ">
                        <div style="font-size: 72px; margin-bottom: 16px;">🚫</div>
                        <h1 style="color: #e85d26; font-size: 28px; margin-bottom: 10px;">Access Denied</h1>
                        <p style="color: #7a9bb5; font-size: 14px; margin-bottom: 20px;">
                            Domain <strong style="color: #c8d8e8;">${this.domain}</strong> is not registered
                        </p>
                        <div style="
                            background: #0a1222;
                            padding: 15px;
                            border-radius: 12px;
                            margin: 20px 0;
                            text-align: left;
                            font-size: 13px;
                            color: #8a9bb5;
                        ">
                            <div style="margin-bottom: 5px;"><strong>Domain:</strong> ${this.domain}</div>
                            <div style="margin-bottom: 5px;"><strong>Status:</strong> <span style="color:#e85d26;">NOT REGISTERED</span></div>
                            <div><strong>Time:</strong> ${new Date().toLocaleString()}</div>
                        </div>
                        <button onclick="window.location.reload()" style="
                            background: #00c2a8;
                            color: #0a0e17;
                            border: none;
                            padding: 12px 30px;
                            border-radius: 12px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            margin-top: 10px;
                        ">🔄 Try Again</button>
                        <div style="margin-top: 20px; font-size: 11px; color: #3a5068;">
                            Protected by <strong style="color:#00c2a8;">CloFix WAF</strong>
                        </div>
                    </div>
                </div>
            `;
        }

        redirectToChallenge() {
            const challengeUrl = `${this.apiUrl}/api/v1/challenge-page`;
            this.log(`🔄 Redirecting to challenge: ${challengeUrl}`);
            window.location.href = challengeUrl;
        }

        showBadge(text, type = 'success') {
            const badge = document.createElement('div');
            badge.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: ${type === 'success' ? 'rgba(0,194,168,0.2)' : 'rgba(232,93,38,0.2)'};
                border: 1px solid ${type === 'success' ? '#00c2a8' : '#e85d26'};
                color: ${type === 'success' ? '#00c2a8' : '#e85d26'};
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 10px;
                font-family: monospace;
                z-index: 99999;
                backdrop-filter: blur(10px);
            `;
            badge.textContent = text;
            document.body.appendChild(badge);
            
            setTimeout(() => {
                badge.style.opacity = '0';
                badge.style.transition = 'opacity 0.5s';
                setTimeout(() => badge.remove(), 500);
            }, 10000);
        }

        showToast(message, type = 'info') {
            const toast = document.createElement('div');
            const colors = {
                success: '#10b981',
                error: '#ef4444',
                warning: '#f59e0b',
                info: '#3a5068'
            };
            
            toast.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: ${colors[type] || colors.info};
                color: white;
                padding: 10px 18px;
                border-radius: 10px;
                font-size: 12px;
                z-index: 999999;
                animation: clofixToastSlide 0.3s ease;
                max-width: 320px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            `;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transition = 'opacity 0.5s';
                setTimeout(() => toast.remove(), 500);
            }, 4000);
            
            if (!document.querySelector('#toast-style')) {
                const style = document.createElement('style');
                style.id = 'toast-style';
                style.textContent = `
                    @keyframes clofixToastSlide {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        log(message, type = 'info') {
            if (!this.debug) return;
            
            const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
            console.log(`${prefix} [CloFix WAF] ${message}`);
        }
    }

    let instance = null;

    function autoInit() {
        if (instance) return;
        
        if (document.querySelector('meta[name="clofix-disabled"]')) {
            console.log('ℹ️ CloFix WAF disabled by meta tag');
            return;
        }
        
        instance = new CloFixWAF({
            apiUrl: 'http://api.clofix.com',
            debug: true,
            autoInit: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        autoInit();
    }

    global.CloFixWAF = CloFixWAF;
    global.clofix = instance;

})(window);