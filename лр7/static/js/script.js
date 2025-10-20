document.addEventListener('DOMContentLoaded', () => {
  const message = document.createElement('p');
  message.textContent = 'Скрипт работает!';
  message.style.color = 'red';
  message.style.fontWeight = 'bold';
  document.body.appendChild(message);
});
