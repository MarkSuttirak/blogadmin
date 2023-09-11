import { useFrappeGetDocList } from 'frappe-react-sdk'
import Sidebar from '../components/sidebar';
import { Button, Heading, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Stack, HStack, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import LoadingCircle from '../components/loading';
import { XCircleIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HomeSmile } from '@untitled-ui/icons-react/build/cjs';

const BlogPostsDraft = () => {
  const { data, isLoading, error } = useFrappeGetDocList('Blog Post', {
    fields: ['name','title','blog_category','published_on'],
    filters: [['published','=','false']]
  })

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