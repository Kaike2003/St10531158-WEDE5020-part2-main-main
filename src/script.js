/* script.js - Clarity Health Clinic (WEDE5020 POE Part 3)
   Covers: animations, DOM manipulation, dynamic content, search/filter/sort,
   lightbox gallery, form validation, AJAX submission, mailto email compiler. */
(function () {
	'use strict';

	/* ====== CONFIG ====== */
	const CLINIC_EMAIL = 'info@clarityhealthclinic.co.za'; // recipient used by contact.html
	const PHONE_RE = /^(\+27|0)\d{9}$/; // South African numbers (spaces ignored)

	const SERVICES = [
		{ id: 'general', name: 'General Consultation', category: 'consultation', price: 650, duration: '30 min', days: [1, 2, 3, 4, 5], desc: 'Routine health checks, acute illness and personalised treatment plans.' },
		{ id: 'chronic', name: 'Chronic Condition Review', category: 'chronic', price: 850, duration: '45 min', days: [2, 3, 4], desc: 'Ongoing monitoring and medication review for long-term conditions.' },
		{ id: 'screening', name: 'Preventive Health Screening', category: 'prevention', price: 950, duration: '60 min', days: [1, 3, 5], desc: 'Blood pressure, glucose, cholesterol and lifestyle assessment.' },
		{ id: 'vaccination', name: 'Vaccinations', category: 'prevention', price: 350, duration: '15 min', days: [1, 2, 3, 4, 5, 6], desc: 'Seasonal flu shots and travel or childhood immunisations.' },
		{ id: 'family', name: 'Family Health Visit', category: 'family', price: 1100, duration: '60 min', days: [1, 2, 4, 5], desc: 'Joint consultation for parents and children in one visit.' },
		{ id: 'senior', name: 'Senior Wellness Check', category: 'family', price: 750, duration: '40 min', days: [2, 3, 4], desc: 'Mobility, medication and preventive review for older patients.' }
	];

	const TIPS = [
		{ title: 'Stay hydrated', text: 'Aim for six to eight glasses of water a day, more in hot weather.' },
		{ title: 'Move every day', text: '30 minutes of brisk walking supports heart health and mood.' },
		{ title: 'Sleep matters', text: 'Adults need 7-9 hours; keep a consistent bedtime routine.' },
		{ title: 'Know your numbers', text: 'Check blood pressure and glucose yearly, even when you feel fine.' }
	];

	const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	/* ====== HELPERS ====== */
	const $ = (sel, ctx = document) => ctx.querySelector(sel);
	const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
	const money = n => 'R' + n.toLocaleString('en-ZA');
	const fmtDate = d => d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' });
	const todayISO = () => new Date().toISOString().split('T')[0];

	/* ====== 1. ANIMATIONS (CSS + JS) ====== */
	function initAnimations() {
		const targets = $$('.animate-fadeUp, .card, .icon-item');
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce || !('IntersectionObserver' in window)) {
			document.documentElement.classList.add('reduced-motion');
			targets.forEach(el => el.classList.add('in-view'));
			return;
		}
		$$('.animate-onload').forEach(el => el.classList.add('in-view'));
		const io = new IntersectionObserver((entries, obs) => {
			entries.forEach(e => {
				if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); }
			});
		}, { threshold: 0.12 });
		targets.forEach(el => io.observe(el));

		// Button ripple
		document.addEventListener('click', e => {
			const btn = e.target.closest('.btn-primary, .btn-ghost, .btn-secondary');
			if (!btn) return;
			const r = btn.getBoundingClientRect();
			const size = Math.max(r.width, r.height);
			const span = document.createElement('span');
			span.className = 'ripple';
			span.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
			btn.appendChild(span);
			setTimeout(() => span.remove(), 650);
		});

		// Hero image parallax
		const hero = $('.hero-image');
		if (hero) {
			window.addEventListener('scroll', () => {
				hero.style.transform = `translateY(${Math.min(window.scrollY * 0.05, 20)}px)`;
			}, { passive: true });
		}
	}

	function markActiveNav() {
		const page = location.pathname.split('/').pop() || 'index.html';
		$$('.nav-links a').forEach(a => {
			if (a.getAttribute('href') === page) a.setAttribute('aria-current', 'page');
		});
	}

	/* ====== 2. DYNAMIC CONTENT: health tips (index) ====== */
	function initTips() {
		const box = $('#tips-list');
		if (!box) return;
		TIPS.forEach(t => {
			const div = document.createElement('div');
			div.className = 'tip';
			const h = document.createElement('h4'); h.textContent = t.title;
			const p = document.createElement('p'); p.textContent = t.text;
			div.append(h, p);
			box.appendChild(div);
		});
	}

	/* ====== 3. DYNAMIC SERVICES + SEARCH / FILTER / SORT ====== */
	function initServices() {
		const grid = $('#services-grid');
		if (!grid) return;
		const search = $('#service-search');
		const cat = $('#service-category');
		const sort = $('#service-sort');
		const count = $('#service-count');

		function render() {
			const q = search.value.trim().toLowerCase();
			const list = SERVICES.filter(s =>
				(cat.value === 'all' || s.category === cat.value) &&
				(s.name + ' ' + s.desc + ' ' + s.category).toLowerCase().includes(q)
			);
			const [key, dir] = sort.value.split('-');
			list.sort((a, b) => key === 'name' ? a.name.localeCompare(b.name) : a.price - b.price);
			if (dir === 'desc') list.reverse();

			grid.innerHTML = '';
			list.forEach(s => {
				const card = document.createElement('article');
				card.className = 'card in-view';
				card.innerHTML = `
					<span class="tag"></span>
					<h3></h3>
					<p></p>
					<div class="service-meta"><span class="price"></span><span class="dur"></span></div>
					<p style="margin-top:12px"><a class="btn-primary" href="enquiry.html?service=${encodeURIComponent(s.id)}">Enquire</a></p>`;
				card.querySelector('.tag').textContent = s.category;
				card.querySelector('h3').textContent = s.name;
				card.querySelector('p').textContent = s.desc;
				card.querySelector('.price').textContent = money(s.price);
				card.querySelector('.dur').textContent = s.duration;
				grid.appendChild(card);
			});
			if (!list.length) {
				const empty = document.createElement('p');
				empty.className = 'empty-state';
				empty.textContent = 'No services match your search. Try a different keyword.';
				grid.appendChild(empty);
			}
			count.textContent = `${list.length} service${list.length === 1 ? '' : 's'} found`;
		}
		[search, cat, sort].forEach(el => el.addEventListener('input', render));
		render();
	}

	/* ====== 4. LIGHTBOX GALLERY ====== */
	function initLightbox() {
		const items = $$('.gallery-item');
		if (!items.length) return;
		let current = 0;

		const box = document.createElement('div');
		box.className = 'lightbox';
		box.setAttribute('role', 'dialog');
		box.setAttribute('aria-modal', 'true');
		box.setAttribute('aria-label', 'Image viewer');
		box.innerHTML = `
			<button class="lb-close" aria-label="Close">&times;</button>
			<button class="lb-prev" aria-label="Previous image">&#8249;</button>
			<figure><img alt=""><figcaption></figcaption></figure>
			<button class="lb-next" aria-label="Next image">&#8250;</button>`;
		document.body.appendChild(box);
		const img = $('img', box), cap = $('figcaption', box);

		function show(i) {
			current = (i + items.length) % items.length;
			const src = items[current].dataset.full || $('img', items[current]).src;
			img.src = src;
			img.alt = $('img', items[current]).alt;
			cap.textContent = img.alt;
		}
		function open(i) { show(i); box.classList.add('open'); $('.lb-close', box).focus(); }
		function close() { box.classList.remove('open'); items[current].focus(); }

		items.forEach((it, i) => it.addEventListener('click', () => open(i)));
		$('.lb-close', box).addEventListener('click', close);
		$('.lb-prev', box).addEventListener('click', () => show(current - 1));
		$('.lb-next', box).addEventListener('click', () => show(current + 1));
		box.addEventListener('click', e => { if (e.target === box) close(); });
		document.addEventListener('keydown', e => {
			if (!box.classList.contains('open')) return;
			if (e.key === 'Escape') close();
			if (e.key === 'ArrowLeft') show(current - 1);
			if (e.key === 'ArrowRight') show(current + 1);
		});
	}

	/* ====== 5. FORM VALIDATION (client side + error handling) ====== */
	function fieldError(input, msg) {
		const err = document.getElementById(input.id + '-error');
		if (err) err.textContent = msg;
		input.setAttribute('aria-invalid', msg ? 'true' : 'false');
	}

	function validateField(input) {
		if (input.disabled || input.closest('[hidden]')) { fieldError(input, ''); return true; }
		const v = input.value.trim();
		let msg = '';
		if (input.required && !v) msg = 'This field is required.';
		else if (v && input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Enter a valid email address (e.g. name@example.com).';
		else if (v && input.type === 'tel' && !PHONE_RE.test(v.replace(/[\s-]/g, ''))) msg = 'Enter a valid South African number, e.g. 021 555 0123 or +27 21 555 0123.';
		else if (v && input.minLength > 0 && v.length < input.minLength) msg = `Please enter at least ${input.minLength} characters (currently ${v.length}).`;
		else if (v && input.maxLength > 0 && v.length > input.maxLength) msg = `Maximum ${input.maxLength} characters allowed.`;
		else if (v && input.type === 'date' && input.min && v < input.min) msg = 'Please choose today or a future date.';
		else if (v && input.dataset.pattern && !new RegExp(input.dataset.pattern).test(v)) msg = input.dataset.patternMsg || 'Invalid format.';
		fieldError(input, msg);
		return !msg;
	}

	function validateForm(form) {
		let firstBad = null;
		$$('input:not([type=checkbox]), select, textarea', form).forEach(el => {
			if (!validateField(el) && !firstBad) firstBad = el;
		});
		if (firstBad) firstBad.focus();
		return !firstBad;
	}

	function liveValidate(form) {
		$$('input:not([type=checkbox]), select, textarea', form).forEach(el => {
			el.addEventListener('blur', () => validateField(el));
			el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') validateField(el); });
		});
	}

	function setStatus(el, msg, ok) {
		if (!el) return;
		el.textContent = msg;
		el.className = 'form-status ' + (ok ? 'ok' : 'err');
	}

	/* ====== 6. LOGIN (simulated) ====== */
	function initLogin() {
		const form = $('#login-form');
		if (!form) return;
		liveValidate(form);
		form.addEventListener('submit', e => {
			e.preventDefault();
			const status = $('#login-status');
			if (!validateForm(form)) { setStatus(status, 'Please fix the errors above.', false); return; }
			setStatus(status, 'Login successful - redirecting...', true);
			setTimeout(() => { window.location.href = 'contact.html'; }, 900);
		});
	}

	/* ====== 7. ENQUIRY FORM (services / products / volunteer / sponsor) ====== */
	function nextAvailable(service, preferredISO) {
		const start = preferredISO ? new Date(preferredISO + 'T00:00:00') : new Date(Date.now() + 86400000);
		for (let i = 0; i < 14; i++) {
			const d = new Date(start); d.setDate(start.getDate() + i);
			if (service.days.includes(d.getDay())) return { date: d, exact: i === 0 && !!preferredISO };
		}
		return null;
	}

	function processEnquiry(data) {
		const lines = [];
		let title = 'Thank you, ' + data.name.split(' ')[0] + '!';

		if (data.contactAs === 'organization' && data.orgType === 'npo' && (data.volunteer || data.sponsor)) {
			if (data.volunteer) lines.push('Volunteering: our community coordinator will email you about current opportunities (health-awareness days, patient support and admin help).');
			if (data.sponsor) lines.push('Sponsorship: sponsor packages start at R2 500 per event. We will send our sponsorship brochure to ' + data.email + '.');
			return { title, lines };
		}

		const svc = SERVICES.find(s => s.id === data.service);
		if (svc) {
			lines.push(`Service: ${svc.name} (${svc.duration})`);
			let cost = svc.price;
			if (data.contactAs === 'organization' && data.orgType === 'business') {
				cost = Math.round(svc.price * 0.9);
				lines.push('Business discount of 10% applied for group bookings.');
			}
			lines.push('Estimated cost: ' + money(cost) + ' per patient.');
			const avail = nextAvailable(svc, data.date);
			if (avail) {
				lines.push(avail.exact
					? `Good news - ${fmtDate(avail.date)} is available.`
					: `Your date is not available for this service. Next available: ${fmtDate(avail.date)}.`);
			}
			lines.push('Available on: ' + svc.days.map(d => DAY_NAMES[d].slice(0, 3)).join(', ') + '.');
		} else {
			lines.push('Our team will review your message and reply within one working day.');
		}
		return { title, lines };
	}

	function initEnquiry() {
		const form = $('#enquiry-form');
		if (!form) return;

		const as = $('#contact-as'), orgBox = $('#org-fields'), orgType = $('#org-type'), npoBox = $('#npo-actions');
		const svcSelect = $('#service');
		SERVICES.forEach(s => {
			const o = document.createElement('option');
			o.value = s.id; o.textContent = `${s.name} - ${money(s.price)}`;
			svcSelect.appendChild(o);
		});
		const pre = new URLSearchParams(location.search).get('service');
		if (pre) svcSelect.value = pre;
		$('#pref-date').min = todayISO();

		function toggleOrg() {
			const isOrg = as.value === 'organization';
			orgBox.hidden = !isOrg;
			$('#org-name').required = isOrg;
			npoBox.hidden = !(isOrg && orgType.value === 'npo');
		}
		as.addEventListener('change', toggleOrg);
		orgType.addEventListener('change', toggleOrg);
		toggleOrg();
		liveValidate(form);

		form.addEventListener('submit', async e => {
			e.preventDefault();
			const status = $('#enquiry-status'), box = $('#enquiry-result');
			box.hidden = true;
			if (!validateForm(form)) { setStatus(status, 'Please correct the highlighted fields.', false); return; }

			const data = {
				name: $('#fullname').value.trim(), email: $('#email').value.trim(),
				contactAs: as.value, orgType: orgType.value,
				volunteer: $('#enquire-volunteer').checked, sponsor: $('#become-sponsor').checked,
				service: svcSelect.value, date: $('#pref-date').value
			};
			const result = processEnquiry(data);

			// AJAX submission (works once a real Formspree ID is set in the form action)
			setStatus(status, 'Sending...', true);
			try {
				if (!form.action.includes('YOUR_FORM_ID')) {
					const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
					if (!res.ok) throw new Error('Server error ' + res.status);
				}
				setStatus(status, 'Enquiry sent successfully.', true);
				box.innerHTML = '';
				const h = document.createElement('h4'); h.textContent = result.title;
				box.appendChild(h);
				result.lines.forEach(l => { const p = document.createElement('p'); p.textContent = l; box.appendChild(p); });
				box.hidden = false;
				box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
				form.reset(); toggleOrg();
			} catch (err) {
				setStatus(status, 'Could not send your enquiry. Please check your connection and try again.', false);
			}
		});
	}

	/* ====== 8. CONTACT FORM -> compiled email (mailto) ====== */
	function initContact() {
		const form = $('#contact-form');
		if (!form) return;
		liveValidate(form);
		form.addEventListener('submit', e => {
			e.preventDefault();
			const status = $('#contact-status'), preview = $('#email-preview');
			preview.hidden = true;
			if (!validateForm(form)) { setStatus(status, 'Please correct the highlighted fields.', false); return; }

			const name = $('#c-name').value.trim();
			const email = $('#c-email').value.trim();
			const phone = $('#c-phone').value.trim();
			const typeSel = $('#c-type');
			const type = typeSel.options[typeSel.selectedIndex].text;
			const msg = $('#c-message').value.trim();

			const subject = `${type} - ${name}`;
			const body = `Hello Clarity Health Clinic,\n\n${msg}\n\n---\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'not provided'}\nMessage type: ${type}`;
			const href = `mailto:${CLINIC_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

			$('#preview-to').textContent = CLINIC_EMAIL;
			$('#preview-subject').textContent = subject;
			$('#preview-body').textContent = body;
			$('#send-email').href = href;
			preview.hidden = false;
			setStatus(status, 'Your email is ready. Press "Send email" to open it in your email app.', true);
			preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		});
	}

	/* ====== INIT ====== */
	document.addEventListener('DOMContentLoaded', () => {
		initAnimations();
		markActiveNav();
		initTips();
		initServices();
		initLightbox();
		initLogin();
		initEnquiry();
		initContact();
	});
})();