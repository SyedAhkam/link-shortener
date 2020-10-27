const urlField = document.getElementById('url-field');
const idField = document.getElementById('id-field');
const createButton = document.getElementById('create-button');
const resultDiv = document.getElementById('result-div');

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;

let resultNode;

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST', 
    mode: 'same-origin', 
    cache: 'no-cache', 
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response.json(); 
}

function toggleClass(node, newClass) {
	node.className = '';
	node.classList.add(newClass);
}


function showResult(result, color=null) {
	if (resultNode) {
		if (color) toggleClass(resultNode, color);
		resultNode.innerHTML = result;
	} else {
		node = document.createElement('p');
		textNode = document.createTextNode(result);
		node.appendChild(textNode);
		if (color) toggleClass(node, color);
		
		resultDiv.appendChild(node);
		resultNode = node;
	}
}

createButton.addEventListener('click', (e) => {
	let url = urlField.value;
	let id = idField.value;
	
	if (!url) return showResult('Please enter a URL.', color='has-text-danger');
	if (!url.match(urlRegex)) return showResult('Please enter a valid URL.', color='has-text-danger');
	if (!id) id = null;
	
	postData('/new', { urlToShorten: url, id: id })
	  .then(data => {
		if (data.error) return showResult(data.error, color='has-text-danger');
		showResult(`Your shortened url is: ${data.shortenedURL}`, color='has-text-success');
	  });
	
});
