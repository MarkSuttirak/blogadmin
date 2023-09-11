const Breadcrumb = () => {
  return (
    <nav className="hidden sm:flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div className="flex">
            <Link to='/' className="text-sm font-medium text-gray-500 hover:text-gray-700">
              <HomeSmile />
            </Link>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            <Link to="/settings" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
              Settings
            </Link>
          </div>
        </li>
        {activeMenu !== '/settings' && (
          <li>
            <div className="flex items-center">
              <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
              <a href="#" aria-current="page" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                {title}
              </a>
            </div>
          </li>
        )}
      </ol>
    </nav>
  )
}

export default Breadcrumb