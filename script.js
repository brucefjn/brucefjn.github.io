'use strict';

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});
window.matchMedia('(min-width: 1081px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
let scrollScheduled = false;
function markCurrentSection() {
  let current = '';
  for (const section of sections) {
    const bounds = section.getBoundingClientRect();
    if (bounds.top <= 180 && bounds.bottom > 180) current = section.id;
  }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 15) current = 'contact';
  navLinks.forEach(link => {
    const selected = link.getAttribute('href') === '#' + current;
    link.classList.toggle('active', selected);
    if (selected) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollScheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scrollScheduled) {
    scrollScheduled = true;
    window.requestAnimationFrame(markCurrentSection);
  }
}, { passive: true });
markCurrentSection();

const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab, focus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.querySelector('#' + item.getAttribute('aria-controls')).hidden = !selected;
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let destination;
    if (event.key === 'ArrowRight') destination = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') destination = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') destination = 0;
    if (event.key === 'End') destination = tabs.length - 1;
    if (destination !== undefined) {
      event.preventDefault();
      selectTab(tabs[destination], true);
    }
  });
});

const dialog = document.querySelector('#figure-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogCaption = document.querySelector('#dialog-caption');
const dialogTitle = document.querySelector('#dialog-title');
let figureOpener;
document.querySelectorAll('.zoom-trigger').forEach(button => {
  button.addEventListener('click', () => {
    figureOpener = button;
    dialogImage.src = button.dataset.image;
    dialogImage.alt = button.querySelector('img').alt;
    dialogCaption.textContent = button.dataset.caption;
    dialogTitle.textContent = button.dataset.title || 'Research figure';
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  if (figureOpener) figureOpener.focus({ preventScroll: true });
});
