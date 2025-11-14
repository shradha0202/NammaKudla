// Lightweight site script: newsletter toast + image fade-in
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Fade images in when loaded (works whether images are cached or loaded)
    const imgs = document.querySelectorAll('.post-card img, .destination-card img');
    imgs.forEach((img) => {
      // ensure transition exists
      img.style.transition = 'opacity .6s ease, transform .6s ease';
      img.style.opacity = img.complete && img.naturalWidth > 0 ? '1' : '0';
      img.style.transform = img.complete ? 'none' : 'translateY(6px)';

      if (!img.complete) {
        img.addEventListener('load', function () {
          img.style.opacity = '1';
          img.style.transform = 'none';
        });
        // in case of error, remove placeholder transform
        img.addEventListener('error', function () {
          img.style.opacity = '1';
          img.style.transform = 'none';
          img.classList.add('muted');
        });
      }
    });

    // Newsletter form handling (client-side only)
    const form = document.getElementById('newsletter-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = (form.elements['name'] && form.elements['name'].value) || '';
        const email = (form.elements['email'] && form.elements['email'].value) || '';

        if (!email || email.indexOf('@') === -1) {
          showToast('Please enter a valid email address', 2600);
          return;
        }

        // Simulate a successful submission (no network call)
        showToast(`Thanks ${name || 'friend'} — you are subscribed!`, 3200);
        form.reset();
      });
    }

    // Contact form handling (client-side demo) — show inline message under form
  const contactForm = document.getElementById('contact-form');
  const contactMsgEl = document.getElementById('contact-status');
    if (contactForm && contactMsgEl) {
      function showInlineMessage(type, message, duration) {
        duration = duration || 3500;
        contactMsgEl.textContent = message;
        contactMsgEl.classList.remove('contact-message--success', 'contact-message--error');
        contactMsgEl.classList.add(type === 'error' ? 'contact-message--error' : 'contact-message--success');
        contactMsgEl.hidden = false;
        contactMsgEl.setAttribute('aria-hidden', 'false');

        // clear after duration
        clearTimeout(contactMsgEl._hideTimer);
        contactMsgEl._hideTimer = setTimeout(function () {
          contactMsgEl.style.transition = 'opacity .28s ease, transform .28s ease';
          contactMsgEl.hidden = true;
          contactMsgEl.setAttribute('aria-hidden', 'true');
        }, duration);
      }

      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = (contactForm.elements['name'] && contactForm.elements['name'].value) || '';
        const email = (contactForm.elements['email'] && contactForm.elements['email'].value) || '';
        const message = (contactForm.elements['message'] && contactForm.elements['message'].value) || '';
        if (!name || !email || !message) {
          showInlineMessage('error', 'Please fill name, email and message', 3200);
          return;
        }

        // Demo: show inline success message and reset form
        showInlineMessage('success', 'Thanks — your message has been sent!', 3800);
        contactForm.reset();
      });
    }

      // ---- Admin: User & Content management (client-side demo) ----
      const userForm = document.getElementById('user-form');
      const userList = document.getElementById('user-list');
      if (userForm && userList) {
        userForm.addEventListener('submit', function (e) {
          e.preventDefault();
          const name = (document.getElementById('u-name') || {}).value || '';
          const role = (document.getElementById('u-role') || {}).value || '';
          const email = (document.getElementById('u-email') || {}).value || '';
          if (!name || !role || !email) {
            showToast('Please complete all user fields', 2200);
            return;
          }
          const tr = createUserRow(name, role, email);
          userList.appendChild(tr);
          userForm.reset();
          showToast('User added', 1800);
        });
      }

      const postForm = document.getElementById('post-form');
      const postList = document.getElementById('post-list');
      if (postForm && postList) {
        postForm.addEventListener('submit', function (e) {
          e.preventDefault();
          const title = (document.getElementById('post-title') || {}).value || '';
          const category = (document.getElementById('post-category') || {}).value || '';
          const content = (document.getElementById('post-content') || {}).value || '';
          if (!title || !category || !content) {
            showToast('Please complete all post fields', 2200);
            return;
          }
          const tr = createPostRow(title, category);
          postList.appendChild(tr);
          postForm.reset();
          showToast('Post added', 1800);
        });
      }

      function createUserRow(name, role, email) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${escapeHtml(name)}</td>
          <td>${escapeHtml(role)}</td>
          <td>${escapeHtml(email)}</td>
          <td class="admin-actions">
            <button class="btn-edit">Edit</button>
            <button class="btn-delete">Delete</button>
          </td>`;

        tr.querySelector('.btn-delete').addEventListener('click', function () {
          tr.remove();
          showToast('User removed', 1400);
        });
        tr.querySelector('.btn-edit').addEventListener('click', function () {
          const newName = prompt('Edit name', name) || name;
          const newRole = prompt('Edit role', role) || role;
          const newEmail = prompt('Edit email', email) || email;
          tr.children[0].innerText = newName;
          tr.children[1].innerText = newRole;
          tr.children[2].innerText = newEmail;
          showToast('User updated', 1400);
        });
        return tr;
      }

      function createPostRow(title, category) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${escapeHtml(title)}</td>
          <td>${escapeHtml(category)}</td>
          <td class="admin-actions">
            <button class="btn-edit">Edit</button>
            <button class="btn-delete">Delete</button>
          </td>`;

        tr.querySelector('.btn-delete').addEventListener('click', function () {
          tr.remove();
          showToast('Post removed', 1400);
        });
        tr.querySelector('.btn-edit').addEventListener('click', function () {
          const newTitle = prompt('Edit title', title) || title;
          const newCat = prompt('Edit category', category) || category;
          tr.children[0].innerText = newTitle;
          tr.children[1].innerText = newCat;
          showToast('Post updated', 1400);
        });
        return tr;
      }

      // small helper to avoid XSS when injecting into table cells
      function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (s) {
          return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
          })[s];
        });
      }

    // Simple toast implementation
    function showToast(message, duration) {
      duration = duration || 3000;
      const toast = document.createElement('div');
      toast.className = 'nk-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = message;

      // basic inline styling (keeps file self-contained)
      Object.assign(toast.style, {
        position: 'fixed',
        left: '50%',
        bottom: '26px',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(90deg,#bfa980,#7c4a2d)',
        color: '#fff',
        padding: '10px 16px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(59,47,39,0.18)',
        zIndex: 99999,
        fontWeight: 700,
        opacity: '1',
      });

      document.body.appendChild(toast);

      // auto dismiss
      setTimeout(function () {
        toast.style.transition = 'opacity .35s ease, transform .35s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(8px)';
      }, duration);

      setTimeout(function () {
        try {
          toast.remove();
        } catch (err) {}
      }, duration + 500);
    }
  });
})();
