import { useFrappeDeleteDoc, useFrappeFileUpload, useFrappeGetDocList } from 'frappe-react-sdk'
import Sidebar from '../components/sidebar';
import LoadingCircle from '../components/loading';
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon, CheckCircleIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useRef, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { HomeSmile } from '@untitled-ui/icons-react/build/cjs';
import { useForm } from 'react-hook-form';

const BlogPosts = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [limitData, setLimitData] = useState(5)

  const [showError, setShowError] = useState(false)

  const { data, isLoading, error, mutate } = useFrappeGetDocList('Blog Post', {
    fields: ['name','title','blog_category','published_on','published', 'meta_image'],
    limit_start: limitData * currentPage,
    limit: limitData
  })

  const { data:allData, mutate:mutateAll } = useFrappeGetDocList('Blog Post')

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

  const { deleteDoc, loading } = useFrappeDeleteDoc()

  const [showDeleteNotification, setShowDeleteNotification] = useState(false)

  const cancelButtonRef = useRef(null)
  const { register, handleSubmit, formState: {errors} } = useForm()

  const [rowNum, setRowNum] = useState(null);
  const [rowName, setRowName] = useState(null);

  const [openDeleteBlog, setOpenDeleteBlog] = useState(false);

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

  const openToDeleteBlog = (index, name) => {
    setRowName(name);
    setRowNum(index);
    setOpenDeleteBlog(true);
  }

  const deleteBlog = (info) => {
    deleteDoc('Blog Post', data[rowNum].name, info)
    .then(() => {
      mutate();
      mutateAll();
      setOpenDeleteBlog(false);
      setShowDeleteNotification(true);
      setShowError(false);
      setTimeout(() => {
        setShowDeleteNotification(false)
      }, 10000)
    }).catch(() => {
      setOpenDeleteBlog(false);
      setShowDeleteNotification(true);
      setShowError(true);
      setTimeout(() => {
        setShowDeleteNotification(false)
      }, 10000)
    })
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
                  Blog Posts
                </p>
              </div>
            </li>
          </ol>
        </nav>
        <div className="flex items-center justify-between mb-8">
          <h1 className="main-title">Blog Posts</h1>
          <Link to='/blog-posts/add'
            className="btn primary-btn"
          >
            Add Post
          </Link>
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
                        <th scope="col" className="table-head-text">
                          Image
                        </th>
                        <th scope="col" className="table-head-text w-[40%]">
                          Title
                        </th>
                        <th scope="col" className="table-head-text">
                          Category
                        </th>
                        <th scope="col" className="table-head-text">
                          Date
                        </th>
                        <th scope="col" className="table-head-text">
                          Status
                        </th>
                        <th scope="col" className="table-head-text text-right pr-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {data.map((d, index) => (
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
                          <td className="table-desc min-w-[80px] w-[80px] pr-5">
                            <img src={d.meta_image} className='rounded-lg'/>
                          </td>
                          <td className="table-title w-[40%]">
                            {d.title}
                          </td>
                          <td className="table-desc">{d.blog_category}</td>
                          <td className="table-desc">{d.published_on}</td>
                          <td className="table-desc">{d.published === 1 ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                              Draft
                            </span>
                          )}</td>
                          <td className="relative whitespace-nowrap py-4 flex gap-x-3 justify-end pr-4">
                            <Link className='btn secondary-btn' to={`/view-post/${d.name}`}>Preview</Link>
                            <Link className='btn secondary-btn' to={`/blog-posts/edit/${d.name}`}>Edit</Link>
                            <button className='btn primary-btn error' onClick={() => openToDeleteBlog(index, d.title)}>Delete</button>
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

      <Transition.Root show={openDeleteBlog} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" initialFocus={cancelButtonRef} onClose={setOpenDeleteBlog}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <form onSubmit={handleSubmit(deleteBlog)}>
                    <div className="bg-white p-6">
                      <div className="text-left">
                        <label htmlFor='add-cate' className="main-heading">
                          Delete Blog: {rowName}
                        </label>
                        <div className="mt-4">
                          <p>Are you sure to delete this blog? This action cannot be undone.</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 py-4 flex px-6 justify-end gap-x-3">
                      <button
                        className="btn white-outline-btn"
                        onClick={(e) => {e.preventDefault();setOpenDeleteBlog(false)}}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        className="btn primary-btn error"
                      >
                        {loading ? 'Deleting' : 'Delete'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

            {/* The nofitication for confirmation of deleting a blog category */}
            <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-[999]"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={showDeleteNotification}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  {showError ? (
                    <>
                      <div className="flex-shrink-0">
                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">An error occurred</p>
                        <p className="mt-1 text-sm text-gray-500">There has been an error deleting the post, please try again.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">Blog deleted</p>
                        <p className="mt-1 text-sm text-gray-500">This blog has been successfully deleted.</p>
                      </div>
                    </>
                  )}
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setShowDeleteNotification(false)
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  )
}

export default BlogPosts;