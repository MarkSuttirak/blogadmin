import { useFrappeDeleteDoc, useFrappeFileUpload, useFrappeGetDocList } from 'frappe-react-sdk'
import Sidebar from '../components/sidebar';
import LoadingCircle from '../components/loading';
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon, CheckCircleIcon, XMarkIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useRef, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { HomeSmile } from '@untitled-ui/icons-react/build/cjs';
import { useForm } from 'react-hook-form';

const BlogPosts = () => {
  const { data, isLoading, error, mutate } = useFrappeGetDocList('Blog Post', {
    fields: ['name','title','blog_category','published_on','published']
  })

  const { deleteDoc, loading } = useFrappeDeleteDoc()

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
      setOpenDeleteBlog(false);
    }).catch(() => {
      setOpenDeleteBlog(false);
    })
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
                        <th scope="col" className="table-head-text w-[50%]">
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
                          <td className="table-title w-[50%]">
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
                            <Link className='btn secondary-btn' to={`/view-post/${d.name}`}>View</Link>
                            <button className='btn secondary-btn'>Edit</button>
                            <button className='btn primary-btn error' onClick={() => openToDeleteBlog(index, d.title)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
    </>
  )
}

export default BlogPosts;