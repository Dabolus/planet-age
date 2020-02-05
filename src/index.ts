import './styles/main.scss';
import { start } from './scripts/main';

if (
  document.readyState === 'complete' ||
  document.readyState === 'interactive'
) {
  start();
} else {
  document.addEventListener('DOMContentLoaded', start);
}
