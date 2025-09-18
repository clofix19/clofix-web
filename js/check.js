<script>
(async function() {
    // ================== Anti-Wappalyzer / JS spoofing ==================
    Object.defineProperty(navigator, 'plugins', { get: () => [1,2,3] });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US','en'] });
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    Object.defineProperty(navigator, 'vendor', { get: () => 'Google Inc.' });

    const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(parameter) {
        if (parameter === this.RENDERER) return "Intel Inc.";
        if (parameter === this.VENDOR) return "Intel";
        return originalGetParameter.call(this, parameter);
    };

    // ================== Virtualization / Sandbox Detection ==================
    function detectVM() {
        let risk = 0;
        let reasons = [];

        // CPU check
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
            risk += 15;
            reasons.push("Low CPU cores (" + navigator.hardwareConcurrency + ")");
        }

        // RAM check
        let ram = navigator.deviceMemory || 0;
        if (ram > 0 && ram <= 8) {
            risk += 15;
            reasons.push("Low RAM (" + ram + " GB)");
        }
        if (ram === 0) {
            risk += 20;
            reasons.push("Unknown RAM reported");
        }

        // Screen resolution check
        if (window.screen.width <= 1366 && window.screen.height <= 768) {
            risk += 10;
            reasons.push("Low screen resolution");
        }

        // Plugins
        if (navigator.plugins.length === 0) {
            risk += 10;
            reasons.push("No browser plugins detected");
        }

        // WebGL Renderer check
        let canvas = document.createElement("canvas");
        let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl) {
            let renderer = gl.getParameter(gl.RENDERER);
            let vendor = gl.getParameter(gl.VENDOR);
            let check = (renderer + " " + vendor).toLowerCase();
            if (check.includes("swiftshader") ||
                check.includes("virtual") ||
                check.includes("vmware") ||
                check.includes("parallels") ||
                check.includes("basic renderer")) {
                risk += 25;
                reasons.push("Virtual GPU detected (" + renderer + ")");
            }
        } else {
            risk += 10;
            reasons.push("No WebGL support");
        }

        // WebDriver
        if (navigator.webdriver) {
            risk += 30;
            reasons.push("WebDriver flag detected");
        }

        // Platform vs UA mismatch
        if (navigator.userAgent.includes("x64") && navigator.platform === "Win32") {
            risk += 15;
            reasons.push("Platform/UA mismatch (x64 vs Win32)");
        }

        // Battery API
        if (navigator.getBattery) {
            navigator.getBattery().then(b => {
                if (b.charging && b.level === 1) {
                    risk += 10;
                    reasons.push("Unrealistic battery state");
                }
            });
        }

        // Media devices
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            navigator.mediaDevices.enumerateDevices().then(devices => {
                if (devices.length < 2) {
                    risk += 10;
                    reasons.push("Few media devices (likely VM)");
                }
            });
        }

        return { vm_risk_score: risk, vm_reasons: reasons };
    }

    const vmResult = detectVM();

    // ================== Collect Client Signals ==================
    const clientSignals = {
        ...vmResult,
        cpu_cores: navigator.hardwareConcurrency,
        ram_gb: navigator.deviceMemory || "unknown",
        platform: navigator.platform || "unknown",
        user_agent: navigator.userAgent,
        vendor: navigator.vendor || "unknown",
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        color_depth: window.screen.colorDepth,
        pixel_depth: window.screen.pixelDepth,
        avail_width: window.screen.availWidth,
        avail_height: window.screen.availHeight,
        plugins_count: navigator.plugins.length,
        languages: navigator.languages || ['unknown'],
        webdriver: navigator.webdriver || false,
        cookies_enabled: navigator.cookieEnabled,
        do_not_track: navigator.doNotTrack,
        canvas_hash: (() => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('CloFixTest', 2, 2);
            return canvas.toDataURL();
        })(),
        webgl_vendor: (() => {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return 'unknown';
            return gl.getParameter(gl.VENDOR) + ' | ' + gl.getParameter(gl.RENDERER);
        })(),
        timezone_offset: new Date().getTimezoneOffset(),
        locale: navigator.language || "unknown",
        connection_type: navigator.connection ? navigator.connection.effectiveType : "unknown",
        downlink: navigator.connection ? navigator.connection.downlink : "unknown",
        rtt: navigator.connection ? navigator.connection.rtt : "unknown",
        service_worker_supported: 'serviceWorker' in navigator,
        local_storage_supported: 'localStorage' in window,
        session_storage_supported: 'sessionStorage' in window,
        indexeddb_supported: 'indexedDB' in window,
        origin_domain: window.location.origin
    };

    // ================== Send to WAF server ==================
    fetch("/check-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientSignals)
    })
    .then(res => res.json())
    .then(data => console.log("CloFix WAF Response:", data))
    .catch(err => console.error("CloFix WAF request failed:", err));
})();
</script>
