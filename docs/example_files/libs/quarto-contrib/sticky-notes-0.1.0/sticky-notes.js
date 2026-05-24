document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.sticky').forEach(function (sticky) {
    var wrapper = document.createElement('div');
    wrapper.className = 'sticky-wrapper';

    // If this sticky is absolutely positioned, move those styles + class to the wrapper
    if (sticky.classList.contains('sticky-positioned')) {
      wrapper.classList.add('sticky-positioned');
      ['top', 'left', 'width', 'height'].forEach(function (prop) {
        if (sticky.style[prop]) {
          wrapper.style[prop] = sticky.style[prop];
          sticky.style[prop] = '';
        }
      });
      if (sticky.style.transform) {
        wrapper.style.transform = sticky.style.transform;
        sticky.style.transform = '';
      }
      sticky.classList.remove('sticky-positioned');
    }

    var shadowOuter = document.createElement('div');
    shadowOuter.className = 'sticky-shadow-outer';
    var shadowInner = document.createElement('div');
    shadowInner.className = 'sticky-shadow-inner';
    shadowOuter.appendChild(shadowInner);

    sticky.parentNode.insertBefore(wrapper, sticky);
    wrapper.appendChild(shadowOuter);
    wrapper.appendChild(sticky);

    makeDraggable(wrapper, sticky);
  });

  var zCounter = 100;

  function makeDraggable(wrapper, sticky) {
    wrapper.classList.add('sticky-draggable');

    sticky.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      // Don't start a drag on interactive content (links, inputs, selecting text in inputs)
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'a' || tag === 'input' || tag === 'textarea' || tag === 'button') return;

      e.preventDefault();

      var rect = wrapper.getBoundingClientRect();

      if (!wrapper.classList.contains('sticky-positioned')) {
        // Clone the wrapper as an invisible placeholder so layout is identical.
        var placeholder = wrapper.cloneNode(true);
        placeholder.classList.add('sticky-placeholder');
        placeholder.style.visibility = 'hidden';
        wrapper.parentNode.insertBefore(placeholder, wrapper);
        wrapper.classList.add('sticky-positioned');
      }

      // Reparent to <body> and normalize left/top to px in document coords.
      // This avoids a jump when the wrapper's left/top were set in em/%/etc.
      if (wrapper.parentNode !== document.body) {
        document.body.appendChild(wrapper);
      }
      wrapper.style.left = (rect.left + window.scrollX) + 'px';
      wrapper.style.top  = (rect.top  + window.scrollY) + 'px';
      wrapper.style.width  = rect.width  + 'px';
      wrapper.style.height = rect.height + 'px';

      wrapper.style.zIndex = ++zCounter;

      var startX = e.clientX;
      var startY = e.clientY;
      var startLeft = parseFloat(wrapper.style.left) || 0;
      var startTop  = parseFloat(wrapper.style.top)  || 0;

      sticky.setPointerCapture(e.pointerId);
      wrapper.classList.add('sticky-dragging');

      function onMove(ev) {
        wrapper.style.left = (startLeft + ev.clientX - startX) + 'px';
        wrapper.style.top  = (startTop  + ev.clientY - startY) + 'px';
      }
      function onUp(ev) {
        sticky.releasePointerCapture(e.pointerId);
        sticky.removeEventListener('pointermove', onMove);
        sticky.removeEventListener('pointerup', onUp);
        sticky.removeEventListener('pointercancel', onUp);
        wrapper.classList.remove('sticky-dragging');
      }
      sticky.addEventListener('pointermove', onMove);
      sticky.addEventListener('pointerup', onUp);
      sticky.addEventListener('pointercancel', onUp);
    });
  }
});
