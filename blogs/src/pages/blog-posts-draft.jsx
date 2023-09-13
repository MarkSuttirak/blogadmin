import { useFrappeGetDocList } from 'frappe-react-sdk'
import LoadingCircle from '../components/loading';
import { XCircleIcon, CheckCircleIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HomeSmile } from '@untitled-ui/icons-react/build/cjs';

const BlogPostsDraft = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [limitData, setLimitData] = useState(5)

  const { data, isLoading, error } = useFrappeGetDocList('Blog Post', {
    fields: ['name','title','blog_category','published_on'],
    filters: [['published','=','false']],
    limit_start: limitData * currentPage,
    limit: limitData
  })

  const { data:allData, mutate:mutateAll } = useFrappeGetDocList('Blog Post', {
    filters: [['published','=','false']],
  })

  const goPrevPage = () => {
    if (currentPage > 0){
      setCurrentPage(currentPage - 1)
    }
  }

  const goNextPage = () => {
    if (allData){
      if (currentPage < Math.ceil(allData.length / limitData) - 1){
        setCurrentPage(currentPage + 1)
      }
    }
  }

  const checkbox = useRef()
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedData, setSelectedData] = useState([])

  // useLayoutEffect(() => {
  //   const isIndeterminate = selectedData.length > 0 && selectedData.length < data.length
  //   setChecked(selectedData.length === data.length)
  //   setIndeterminate(isIndeterminate)
  //   checkbox.current.indeterminate = isIndeterminate
  // }, [selectedData])

  function toggleAll() {
    setSelectedData(checked || indeterminate ? [] : data)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  const PaginationNum = () => {
    if (allData){
      const allPages = Math.ceil(allData.length / limitData);
      let pages = []

      const goToPage = (pageNum) => {
        setCurrentPage(pageNum);
      }

      for (let i = 0; i < allPages; i++){
        pages.push(
          <button key={i} onClick={() => goToPage(i)}
            className={`relative inline-flex items-center border bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 ${currentPage == i ? 'border-[#0099FF] z-10' : 'border-gray-300'}`}
          >
            {i + 1}
          </button>
        )
      }

      return pages;
    }
  }

  return (
    <>
      <div className='page-section'>
        <nav className="flex mb-5" aria-label="Breadcrumb">
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
                <p className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Draft Blog Posts
                </p>
              </div>
            </li>
          </ol>
        </nav>
        <div className="flex items-center justify-between mb-8">
          <h1 className="main-title">Draft Blog Posts</h1>
          <button
            className="btn primary-btn"
          >
            Add Post
          </button>
        </div>
        {data && (
          <div className="flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden ring-1 ring-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className='table-head'>
                      <tr>
                        <th scope="col" className="relative w-12">
                          <input
                            type="checkbox"
                            className="table-checkbox"
                            ref={checkbox}
                            checked={checked}
                            onChange={toggleAll}
                          />
                        </th>
                        <th scope="col" className="table-head-text w-[50%]">
                          Title
                        </th>
                        <th scope="col" className="table-head-text">
                          Category
                        </th>
                        <th scope="col" className="table-head-text">
                          Date
                        </th>
                        <th scope="col" className="table-head-text text-right pr-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {data.map((d) => (
                        <tr key={d.name}>
                          <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                            <input
                              type="checkbox"
                              className="table-checkbox"
                              value={d.name}
                              checked={selectedData.includes(d)}
                              onChange={(e) =>
                                setSelectedData(
                                  e.target.checked
                                    ? [...selectedData, d]
                                    : selectedData.filter((p) => p !== d)
                                )
                              }
                            />
                          </td>
                          <td className="table-title w-[50%]">
                            {d.title}
                          </td>
                          <td className="table-desc">{d.blog_category}</td>
                          <td className="table-desc">{d.published_on}</td>
                          <td className="relative whitespace-nowrap py-4 flex gap-x-3 justify-end pr-4">
                            <button className='btn secondary-btn'>View</button>
                            <button className='btn secondary-btn'>Edit</button>
                            <button className='btn primary-btn error'>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 bg-white py-3">
              <div className="flex flex-1 items-center justify-between">
                {allData && (
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage * limitData) + 1}</span> to <span className="font-medium">{currentPage == Math.ceil(allData.length / limitData) - 1 ? allData.length : limitData * (currentPage + 1)}</span> of{' '}
                      <span className="font-medium">{allData.length}</span> {allData.length == 1 ? 'result' : 'results'}
                    </p>
                  </div>
                )}
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={goPrevPage}
                      className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>

                    <PaginationNum />

                    <button
                      onClick={goNextPage}
                      className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
        {isLoading && (
          <LoadingCircle size={80} innerSize={70}/>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">There was an error loading the data, please try again.</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default BlogPostsDraft;