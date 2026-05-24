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
      // Move transform (tilt) to wrapper too
      if (sticky.style.transform) {
        wrapper.style.transform = sticky.style.transform;
        sticky.style.transform = '';
      }
      sticky.classList.remove('sticky-positioned');
    }

    // Build shadow: outer (blur + top clip) wrapping inner (trapezoid clip-path)
    var shadowOuter = document.createElement('div');
    shadowOuter.className = 'sticky-shadow-outer';
    var shadowInner = document.createElement('div');
    shadowInner.className = 'sticky-shadow-inner';
    shadowOuter.appendChild(shadowInner);

    // Insert wrapper in place of sticky, then move sticky inside it
    sticky.parentNode.insertBefore(wrapper, sticky);
    wrapper.appendChild(shadowOuter);
    wrapper.appendChild(sticky);
  });
});
