export function addLineNumbers (){
  function addNumbers(elements) {
    elements = elements.filter(function (element) {
      var olElement = element.querySelector('code ol');
      if (!olElement) return true;
    });

		var infos = elements.map(function (element) {
      var codeElement = element.querySelector('code');
      var codeLines = codeElement.innerHTML.split(/\n(?!$)/g);

			return {
				element: codeElement,
				lines: codeLines
			};
    }).filter(Boolean);

		infos.forEach(function (info) {
			var element = info.element;
			var lines = info.lines;
      
      element.innerHTML = '';
      
      var numberLine = '';
			lines.forEach(function (line) {
        var newLine = '<li>'
        if (line === '') {
          newLine += ' ';
        } else {
          newLine += line;
        }
        newLine += '</li>';

        numberLine += newLine;
      });

      var olElement = document.createElement('ol');
      olElement.innerHTML = numberLine;

      element.appendChild(olElement);
		});
	}

  const lineNumberCodes = Array.prototype.slice.call(document.querySelectorAll('pre.line-numbers'));
  if (!lineNumberCodes) return;

  addNumbers(lineNumberCodes);
}
