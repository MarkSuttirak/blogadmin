import React, { useState, useEffect, useContext, useRef } from "react";
import Logo from "../assets/img/logo-zaviago.svg";
import switchuser from "../assets/img/switchuser.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CalendarIcon, ChartBarIcon, Cog6ToothIcon, FolderIcon, HomeIcon, InboxIcon, UsersIcon } from '@heroicons/react/24/outline'
import pjob from "../assets/img/pjob.svg";
import { Fragment } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
// import "../css/sidebar-dropdown.css";
import { PlusIcon } from "@heroicons/react/20/solid";
import { HomeSmile, Edit04, Menu01, LayoutAlt01, Backpack, Gift01, Settings01, ArrowLeft, Inbox01, Tag03, Settings04 } from "@untitled-ui/icons-react/build/cjs";
import EarPhone from "./icon-menus/EarPhone";
import GaugeMin from "./icon-menus/GaugeMin";
import Digice from "./icon-menus/Digice";
import IconMock from "./icon-menus/IconMock";
import AppsIcon from "./icon-menus/AppsIcon";
import BoxOpen from "./icon-menus/BoxOpen";
import HomeIconTwo from "./icon-menus/HomeIcon";
import { useFrappeGetDocList } from 'frappe-react-sdk'

// import TeamModal from "../components/switchTeamModal";

const Sidebar = ({ loadingLogo, tooltip }) => {
  const location = useLocation();
  const [active, setActive] = useState('');

  const handleMenuClick = (menu) => {
    setActive(menu);
  }

  const navigate = useNavigate();

  const { data: dataBlog } = useFrappeGetDocList('Blog Post')
  const { data: dataBlogDraft } = useFrappeGetDocList('Blog Post', {
    filters: [['published','=','0']]
  })
  const { data: dataBlogPublished } = useFrappeGetDocList('Blog Post', {
    filters: [['published','=','1']]
  })
  const { data: dataBlogCate } = useFrappeGetDocList('Blog Category')

  const firstNavigation = [
    { name: 'Dashboard', icon: <HomeSmile viewBox='0 0 30 24' width='24' className='menu-icon'/>, href: '', current: active === '/' ? true : false, id: 'dashboard' },
    { name: 'View Site', icon: <LayoutAlt01 viewBox='0 0 30 24' width='24' className='menu-icon'/>, href: '', current: active === '/view-site' ? true : false, id: 'view-site' },
  ]

  const secondNavigation = [
    { name: 'All Posts', icon: <Edit04 viewBox='0 0 30 24' width='24' className='menu-icon'/>, href: '/blog-posts', count: [dataBlog && dataBlog.length, 'blue', 'have-dot'], current: active === '/' || active === '/blog-posts' ? true : false, id: 'blog-posts' },
    { name: 'Draft', icon: <Inbox01 viewBox='0 0 30 24' width='24' className='menu-icon'/>, href: '/blog-posts/draft', count: [dataBlogDraft && dataBlogDraft.length, 'blue', 'have-dot'], current: active === '/blog-posts/draft' ? true : false, id: 'blog-posts-draft' },
    { name: 'Published', icon: <Inbox01 viewBox='0 0 30 24' width='24' className='menu-icon'/>, href: '/blog-posts/published', count: [dataBlogPublished && dataBlogPublished.length, 'blue', 'have-dot'], current: active === '/blog-posts/published' ? true : false, id: 'blog-posts-published' },
    { name: 'Scheduled', icon: <Inbox01 viewBox='0 0 30 24' width='24'className='menu-icon'/>, href: '/blog-posts/scheduled', current: active === '/blog-posts/scheduled' ? true : false, id: 'blog-posts-scheduled' },
  ]

  const thirdNavigation = [
    { name: 'Categories', icon: <Inbox01 viewBox='0 0 30 24' width='24'className='menu-icon'/>, href: '/blog-categories', count: [dataBlogCate && dataBlogCate.length, 'orange', 'have-dot'], current: active === '/blog-categories' ? true : false, id: 'blog-categories' },
    { name: 'Tags', icon: <Tag03 viewBox='0 0 30 24' width='24' className='menu-icon'/>, href: '/tags', current: active === '/tags' ? true : false, id: 'tags' },
    { name: 'Settings', icon: <Settings04 viewBox='0 0 30 24' width='24' className='menu-icon'/>, href: '/settings', current: active === '/settings' ? true : false, id: 'settings' },
  ]

  const leftNavigation = [
    { name: 'Settings', icon: <Cog6ToothIcon width='24'/>, href: '/settings/profile', current: active === '/settings' ? true : false, id: 'settings' },
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  useEffect(() => {
    setActive(location.pathname);
  })

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const [query, setQuery] = useState('')

  const IconSidebar = () => {
    return (
      <nav className="nav-left-side">
        <div className="logo">
          <img src={Logo} />
        </div>
        <Link to='/'>
          <div className="nav-btns" id="home-btn">
            <HomeSmile className='menu-icon'/>
          </div>
        </Link>

        <hr className="vertical-bar d-none d-sm-block" />
        <div className="nav-btns">
          <Backpack className='menu-icon'/>
        </div>
        <div className="nav-btns">
          <Gift01 className='menu-icon'/>
        </div>
        <div id="additional-apps">
          <div className="nav-btns add-ons" style={{background:"#F2F2FD"}}>
            <IconMock />
          </div>
          <div className="nav-btns add-ons" style={{background:"#FFEAE1"}}>
            <Digice />
          </div>
        </div>
        <div id="lower-apps">
          {leftNavigation.map((item) => (
            <Link key={item.id}
            to={item.href}
            className={classNames(
              item.current
                ? 'nav-btns active'
                : 'nav-btns'
            )}>
              {item.icon}
            </Link>
          ))}
          <hr style={{borderColor:"#EBEEF0"}}/>
          <div className="nav-btns">
            <img
              src={pjob}
              alt=""
            />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
    <IconSidebar />
      <div className="flex flex-1 flex-col border-r border-gray-200 bg-white" id="sidebar">
        <div className="flex flex-1 flex-col pt-[18px] pb-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <Link to='' className="flex text-[13px] font-semibold items-center">
              <ArrowLeft viewBox='0 0 30 24' />
              Back
            </Link>
          </div>

            <h2 className="subheading px-4 mt-6">Blogs & News</h2>
            <nav className="flex-1 bg-white px-4 pt-2" aria-label="Sidebar">
              {firstNavigation.map((item) => (
                <>
                  <Link
                    key={item.id}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? 'sidebar-menu active'
                        : 'sidebar-menu'
                    )}
                    onClick={() => handleMenuClick(item.href)}
                  >
                    {item.icon}
                    <span className="flex-1 item-name">{item.name}</span>
                    {item.count ? (
                      <>
                      {/* Desktop Version */}

                      <div className="menu-badge">
                        <span className={`badge-sidebar ${item.count[1] === 'orange' ? 'orange' : item.count[1] === 'blue' ? 'blue' : item.count[1] === 'gray' ? 'gray' : ''}`}>
                          {item.count[2] === 'have-dot' && (
                            <svg className="badge-circle" fill="currentColor" viewBox="0 0 8 8">
                              <circle cx={4} cy={4} r={3} />
                            </svg>
                          )}
                          {item.count[0]}
                        </span>
                      </div>

                      {/* Responsive Version */}
                      </>
                    ) : null}
                  </Link>
                  {/* <div id={`tooltip-${item.id}`} role="tooltip" className="tooltip-menu absolute invisible opacity-0 z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg left-[60px] text-xs translate-y-[-120%] whitespace-pre shadow-sm dark:bg-gray-700">
                    {item.name}
                  </div> */}
                </>
              ))}
            </nav>

            <nav className="flex-1 bg-white px-4 pt-8" aria-label="Sidebar">
              {secondNavigation.map((item) => (
                <>
                  <Link
                    key={item.id}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? 'sidebar-menu active'
                        : 'sidebar-menu'
                    )}
                    onClick={() => handleMenuClick(item.href)}
                  >
                    {item.icon}
                    <span className="flex-1 item-name">{item.name}</span>
                    {item.count ? (
                      <>
                      {/* Desktop Version */}

                      <div className="menu-badge">
                        <span className={`badge-sidebar ${item.count[1] === 'orange' ? 'orange' : item.count[1] === 'blue' ? 'blue' : item.count[1] === 'gray' ? 'gray' : ''}`}>
                          {item.count[2] === 'have-dot' && (
                            <svg className="badge-circle" fill="currentColor" viewBox="0 0 8 8">
                              <circle cx={4} cy={4} r={3} />
                            </svg>
                          )}
                          {item.count[0]}
                        </span>
                      </div>

                      {/* Responsive Version */}
                      </>
                    ) : null}
                  </Link>
                  {/* <div id={`tooltip-${item.id}`} role="tooltip" className="tooltip-menu absolute invisible opacity-0 z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg left-[60px] text-xs translate-y-[-120%] whitespace-pre shadow-sm dark:bg-gray-700">
                    {item.name}
                  </div> */}
                </>
              ))}
            </nav>

            <nav className="flex-1 bg-white px-4 pt-8" aria-label="Sidebar">
              {thirdNavigation.map((item) => (
                <>
                  <Link
                    key={item.id}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? 'sidebar-menu active'
                        : 'sidebar-menu'
                    )}
                    onClick={() => handleMenuClick(item.href)}
                  >
                    {item.icon}
                    <span className="flex-1 item-name">{item.name}</span>
                    {item.count ? (
                      <>
                      {/* Desktop Version */}

                      <div className="menu-badge">
                        <span className={`badge-sidebar ${item.count[1] === 'orange' ? 'orange' : item.count[1] === 'blue' ? 'blue' : item.count[1] === 'gray' ? 'gray' : ''}`}>
                          {item.count[2] === 'have-dot' && (
                            <svg className="badge-circle" fill="currentColor" viewBox="0 0 8 8">
                              <circle cx={4} cy={4} r={3} />
                            </svg>
                          )}
                          {item.count[0]}
                        </span>
                      </div>

                      {/* Responsive Version */}
                      </>
                    ) : null}
                  </Link>
                  {/* <div id={`tooltip-${item.id}`} role="tooltip" className="tooltip-menu absolute invisible opacity-0 z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg left-[60px] text-xs translate-y-[-120%] whitespace-pre shadow-sm dark:bg-gray-700">
                    {item.name}
                  </div> */}
                </>
              ))}
            </nav>
        </div>
      </div>
    </>
  )
}

export default Sidebar;