document.getElementById('app')!.innerHTML = '__UNPLUGIN__'

fetch('/pmc-server/hello', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  mode: 'cors',
})


