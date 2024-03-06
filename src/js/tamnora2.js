export class Tamnora {
  constructor(config = {}) {
    this.data = this.createReactiveProxy(config.data);
    this._componentHTML = config.componentHTML || {};
    this.defaultData = {};
    this.colorPrimary = 'neutral';
    this.class = config.styleClasses || defaultClass();
    this.templates = {};
    this.form = {};
    this.table = {};
    this.theme = '';
    this.themeColorDark = '#262626';
    this.themeColorLight = '#f5f5f5';
    this.componentDirectory = config.componentDirectory || '../components';
    this.state = this.loadStateFromLocalStorage();
    this.onMountCallback = null;
    this.initialize();
    this.darkMode(config.darkMode ?? true);
    this.handleNavigationOnLoad();

    this.functions = {
      openSelect: (name) => {
        const self = this;
        document.getElementById(`${name}_options`).classList.toggle('hidden');
        document.getElementById(`${name}_cerrado`).classList.toggle('hidden');
        document.getElementById(`${name}_abierto`).classList.toggle('hidden');

        document.querySelectorAll(`#${name}_options li`).forEach(function (li) {
          li.addEventListener('click', function (e) {
            self.data[`${name}_selected`] = e.target.innerText;
          });
        });

      }
    };


    // Escuchar el evento de cambio de historial
    window.addEventListener('popstate', () => {
      this.handleNavigation();
    });

  }

}