import {Tamnora} from '../js/tamnora.js';



const tmn = new Tamnora();

const navbarOptions = [
  { type: 'url', name: 'Home', url: './' },
  {
      name: 'Dropdown',
      dropdown: [
          { name: 'Submenu1', url: './' },
          { name: 'Submenu2', url: './' }
      ]
  },
  { type: 'url', name: 'Services', url: './' },
  { type: 'url', name: 'Pricing', url: './' },
  { type: 'url', name: 'Contact', url: './' }
]; 

navbarOptions.forEach(val =>{
  if(val.url){
    console.log(val.name, val.url)
  } else {
    if(val.dropdown){
      console.log(val.name)
      val.dropdown.forEach(sub => {
        console.log(val.name, sub.name, sub.url)
      })
    }
  }
})

let navbar = /*html*/ `
<nav class="fixed top-0 z-50 w-full bg-white border-b border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
          <div class="flex flex-wrap items-center justify-between mx-auto px-3 py-3 lg:px-5 lg:pl-3">
            <div class="flex items-center justify-start">
              <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" class="inline-flex items-center p-2 text-sm text-neutral-500 rounded-lg sm:hidden hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:ring-neutral-600">
                  <span class="sr-only">Open sidebar</span>
                  <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                     <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                  </svg>
               </button>
              <a href="https://tamnora.com" class="flex ml-2 md:mr-24">
                <img src="../images/favicon.png" class="h-8 mr-3" alt="Tamnora Logo" />
                <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Tamnora</span>
              </a>
            </div>
          <div class="flex items-center md:order-2">
              <button type="button" class="flex mr-3 text-sm bg-neutral-800 rounded-full md:mr-0 focus:ring-4 focus:ring-neutral-300 dark:focus:ring-neutral-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                <span class="sr-only">Open user menu</span>
                <img class="w-8 h-8 rounded-full" src="https://source.unsplash.com/100x100/?portrait" alt="user photo">
              </button>
              <!-- Dropdown menu -->
              <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-neutral-100 rounded-lg shadow dark:bg-neutral-700 dark:divide-neutral-600" id="user-dropdown">
                <div class="px-4 py-3">
                  <span class="block text-sm text-neutral-900 dark:text-white">Bonnie Green</span>
                  <span class="block text-sm  text-neutral-500 truncate dark:text-neutral-400">name@tamnora.com</span>
                </div>
                <ul class="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <a href="#" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:text-neutral-200 dark:hover:text-white">Dashboard</a>
                  </li>
    
                  <li>
                    <a href="#" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:text-neutral-200 dark:hover:text-white">Settings</a>
                  </li>
                  <li>
                    <a href="#" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:text-neutral-200 dark:hover:text-white">Earnings</a>
                  </li>
                  <li>
                    <a href="#" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:text-neutral-200 dark:hover:text-white">Sign out</a>
                  </li>
                </ul>
              </div>
              <button data-collapse-toggle="navbar-user" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-neutral-500 rounded-lg md:hidden hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:ring-neutral-600" aria-controls="navbar-user" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
            </button>
          </div>
          <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
            <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-neutral-100 dark:border-neutral-800 rounded-lg bg-neutral-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-neutral-800">
              <li>
                <a href="#" class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
              </li>
              <li>
            <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar" class="flex items-center justify-between w-full py-2 pl-3 pr-4  text-neutral-700 border-b border-neutral-100 hover:bg-neutral-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 md:dark:hover:bg-transparent">Dropdown <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
  </svg></button>
            <!-- Dropdown menu -->
            <div id="dropdownNavbar" class="z-10 hidden font-normal bg-white divide-y divide-neutral-100 rounded-lg shadow w-44 dark:bg-neutral-700 dark:divide-neutral-600">
                <ul class="py-2 text-sm text-neutral-700 dark:text-neutral-400" aria-labelledby="dropdownLargeButton">
                  <li>
                    <a href="#" class="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:hover:text-white">Dashboard</a>
                  </li>
                  <li aria-labelledby="dropdownNavbarLink">
                    <button id="doubleDropdownButton" data-dropdown-toggle="doubleDropdown" data-dropdown-placement="right-start" type="button" class="flex items-center justify-between w-full px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:hover:text-white">Dropdown<svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
  </svg></button>
                    <div id="doubleDropdown" class="z-10 hidden bg-white divide-y divide-neutral-100 rounded-lg shadow w-44 dark:bg-neutral-700">
                        <ul class="py-2 text-sm text-neutral-700 dark:text-neutral-200" aria-labelledby="doubleDropdownButton">
                          <li>
                            <a href="#" class="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:hover:text-white">Overview</a>
                          </li>
                          <li>
                            <a href="#" class="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:hover:text-white">My downloads</a>
                          </li>
                          <li>
                            <a href="#" class="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:hover:text-white">Billing</a>
                          </li>
                          <li>
                            <a href="#" class="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:hover:text-white">Rewards</a>
                          </li>
                        </ul>
                    </div>
                  </li>
                  <li>
                    <a href="#" class="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:hover:text-white">Earnings</a>
                  </li>
                </ul>
                <div class="py-1">
                  <a href="#" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:hover:text-white">Sign out</a>
                </div>
            </div>
        </li>
              <li>
                <a href="#" class="block py-2 pl-3 pr-4 text-neutral-900 rounded hover:bg-neutral-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-neutral-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-neutral-700">About</a>
              </li>
              <li>
                <a href="#" class="block py-2 pl-3 pr-4 text-neutral-900 rounded hover:bg-neutral-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-neutral-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-neutral-700">Services</a>
              </li>
              <li>
                <a href="#" class="block py-2 pl-3 pr-4 text-neutral-900 rounded hover:bg-neutral-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-neutral-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-neutral-700">Pricing</a>
              </li>
              <li>
                <a href="#" class="block py-2 pl-3 pr-4 text-neutral-900 rounded hover:bg-neutral-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-neutral-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-neutral-700">Contact</a>
              </li>
            </ul>
          </div>
          </div>
        </nav>
`



tmn.select('#navbar').html(navbar);