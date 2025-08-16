import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import Loading from '../../../components/Loading';
const MyEvents = () => {
  const { loading, events,page,setPage,totalPages} = useContext(AppContext);
  return (
     
     <div className="p-4">
      {
        loading ? (<Loading/>) : (
          <>
          <h1 className="text-xl font-bold mb-4">My Events</h1>
            <div className="overflow-x-auto">
            <table className="min-w-full border  border-gray-200  overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border border-gray-300">Image</th>
                <th className="px-4 py-2 border border-gray-300">Title</th>
                <th className="px-4 py-2 border border-gray-300">Date</th>
                <th className="px-4 py-2 border border-gray-300">status</th>
                <th className="px-4 py-2 border border-gray-300">Name</th>

                
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map((ev) => {
                  return (
                    <tr key={ev._id} className="hover:bg-gray-50 text-center">
                      <td className="px-4 py-2 border-gray-300 border"><img src={ev.image} className='w-10 m-auto h-10 rounded-full object-cover' alt="" /></td>
                      <td className="px-4 py-2 border-gray-300 border">{ev.title}</td>
                      <td className="px-4 py-2 border-gray-300 border">
                        {new Date(ev.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border-gray-300 border capitalize">{ev.status}</td>
                      <td className="px-4 py-2 border-gray-300 border">{ev.organizer?.name}</td>

                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center px-4 py-4 text-gray-500"
                  >
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-center mt-2 gap-2">
              <button onClick={() => setPage(page - 1, 1)} className='bg-blue-500 text-white px-2 rounded cursor-pointer'>Prev</button>
              <ul className="flex gap-1">
                {[...Array(totalPages)].map((_,i) => (
                  <li key={i} onClick={() => setPage(i + 1)} className={`px-2  border ${i + 1 === page ? 'bg-blue-500 cursor-pointer text-white' : 'text-blue-500'}`}>{i + 1}</li>
                ))}
              </ul>
              <button onClick={() => setPage( page + 1 && totalPages)} className='bg-blue-500 text-white px-2 rounded cursor-pointer'>Next</button>
          </div>
        </div>
          </>
        )
      }
    </div>
  )
}

export default MyEvents