
import Loading from "../../../components/Loading";
import { AppContext } from "../../../context/AppContext";
import { useContext } from "react";


const EditEvents = () => {
  const {loading,events,handleAction,user,navigate,page,setPage,totalPages} = useContext(AppContext)
  



  return (
    <div className="p-4">
      {
        loading ? (
          
            <Loading/>
          
        ) : (
          <>
          <h1 className="text-xl font-bold mb-4">Events Management</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border border-gray-300">Title</th>
                <th className="px-4 py-2 border border-gray-300">Date</th>
                <th className="px-4 py-2 border border-gray-300">Status</th>
                <th className="px-4 py-2 border border-gray-300">Organizer</th>
                <th className="px-4 py-2 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map((ev) => {
                  
                  return (
                    <tr key={ev._id} className="hover:bg-gray-50 text-center">
                      <td className="px-4 py-2 border-gray-300 border">{ev.title}</td>
                      <td className="px-4 py-2 border-gray-300 border">
                        {new Date(ev.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border-gray-300 border capitalize">{ev.status}</td>
                      <td className="px-4 py-2 border-gray-300 border">{ev.organizer?.name}</td>
                      <td className="px-4 py-2 border-gray-300 border space-x-2">
                        {user.role === "admin" && ev.status === "pending" && (
                          <>
                            <button
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                              onClick={() => handleAction(ev._id, "approve")}
                            >
                              Approve
                            </button>
                            <button
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              onClick={() => handleAction(ev._id, "reject")}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {(
                          (user.role === "admin") ||
                          (user.role === "organizer" && ev.organizer?._id === user._id)
                        ) && ev.status !== "cancelled" && (
                            <button
                              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                              onClick={() => handleAction(ev._id, "cancel")}
                            >
                              Cancel
                            </button>
                          )}

                        {(user.role === "admin" || 
                        (user.role === "organizer" && ev.organizer?._id === user._id) && 
                          ev.organizer?._id === user._id) && (
                            <button
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                              onClick={() => navigate('/dashboard/organizer/create-event',{state:{eventId:ev._id}})}
                            >
                              Update
                            </button>
                          )}
                      </td>
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
        </div>
                  <div className="flex items-center justify-center mt-2 gap-2">
              <button onClick={() => setPage(page - 1, 1)} className='bg-blue-500 text-white px-2 rounded cursor-pointer'>Prev</button>
              <ul className="flex gap-1">
                {[...Array(totalPages)].map((_,i) => (
                  <li key={i} onClick={() => setPage(i + 1)} className={`px-2  border ${i + 1 === page ? 'bg-blue-500 cursor-pointer text-white' : 'text-blue-500'}`}>{i + 1}</li>
                ))}
              </ul>
              <button onClick={() => setPage( page + 1 && totalPages)} className='bg-blue-500 text-white px-2 rounded cursor-pointer'>Next</button>
          </div>
        </>
      )}
    </div>
  ) 
}

export default EditEvents
