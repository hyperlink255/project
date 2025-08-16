import React, { useState } from 'react'

const Host = () => {
    const [steps, setSteps] = useState("Step-1");

    return (
        <div className='mt-5'>
            <div className="m-auto max-w-6xl">
                <h1 className='text-3xl font-semibold'>Be a Star Event Host in 4 Easy Steps</h1>
                <p className='mt-2'>Use early-bird discounts, coupons and group ticketing to double your ticket sale. Get paid quickly and securely.</p>
                <div className='grid md:grid-cols-4 grid-cols-1 text-center gap-5 mt-5 border-b border-gray-200'>
                    <div onClick={() => setSteps("Step-1")} className={`${steps === "Step-1" && 'bg-[#6AC045] text-white'} p-5 rounded`}>
                        <h2 className=' text-2xl'>Step 1</h2>
                        <p className='mt-2'>Create your event </p>
                    </div>
                    <div onClick={() => setSteps("Step-2")}   className={`${steps === "Step-2" && 'bg-[#6AC045] text-white'} p-5 rounded `} >
                        <h2 className='text-2xl'>Step 2</h2>
                        <p className='mt-2'>Sell tickets to your event.</p>
                    </div>
                    <div onClick={() => setSteps("Step-3")} className={`${steps === "Step-3" && 'bg-[#6AC045] text-white'} p-5 rounded `}>
                        <h2 className=' text-2xl'>Step 3</h2>
                        <p className='mt-2'>Manage track your revenue.</p>
                    </div>
                    <div onClick={() => setSteps("Step-4")} className={`${steps === "Step-4" && 'bg-[#6AC045] text-white'} p-5 rounded `}>
                        <h2 className='text-2xl'>Step 4</h2>
                        <p className='mt-2'> enjoy the experience!</p>
                    </div>
                </div>
                <div className='mt-5'>
                    <p>Sign up for free and create your event easily in minutes.</p>
                </div>
                <div className="mt-5">
                    <div className="grid md:grid-cols-3 grid-cols-1 gap-5 ">
                        {
                            steps === "Step-1" &&
                            <>
                                <div className="border border-gray-200 p-5 rounded">
                                    <h3 className="font-semibold">Sign up for free</h3>
                                    <p className="mt-2">Sign up easily using your Google or Facebook account or email and create your events in minutes.</p>
                                </div>
                                <div className="border border-gray-200 p-5 rounded">
                                    <h3 className="font-semibold">Use built-in event page template</h3>
                                    <p className="mt-2">Choose from our customised page templates specially designed to attract attendees.</p>
                                </div>
                                <div className="border border-gray-200 p-5 rounded">
                                    <h3 className="font-semibold">Customise your event page as you like</h3>
                                    <p className="mt-2">Add logo, collage hero images, and add details to create an outstanding event page.</p>
                                </div>
                            </>
                        }
                        {
                            steps === "Step-2" &&
                            <>
                                <div className="border border-gray-200 p-5 rounded">
                                    <h3 className="font-semibold">Promote your events on social media & email</h3>
                                    <p className="mt-2">Use our intuitive event promotion tools to reach your target audience and sell tickets.</p>
                                </div>
                                <div className="border border-gray-200 p-5 rounded">
                                    <h3 className="font-semibold">Use early-bird discounts, coupons & group ticketing</h3>
                                    <p className="mt-2">Double your ticket sales using our built-in discounts, coupons and group ticketing features.</p>
                                </div>
                                <div className="border border-gray-200 p-5 rounded">
                                    <h3 className="font-semibold">Get paid quickly & securely</h3>
                                    <p className="mt-2">Use our PCI compliant payment gateways to collect your payment securely.</p>
                                </div>
                            </>
                        }
                        {
                            steps === "Step-3" &&
                            <>
                                <div className="border border-gray-200 p-5 rounded">
                                    <h3 className="font-semibold">Free event hosting</h3>
                                    <p className="mt-2">Use Eventbookings to host any types of online events for free.</p>
                                </div>
                                <div className="border border-gray-200 p-5 rounded">
                                    <h3 className="font-semibold">Built-in video conferencing platform</h3>
                                    <p className="mt-2">No need to integrate with ZOOM or other 3rd party apps, use our built-in video conferencing platform for your events.</p>
                                </div>
                                <div className="border border-gray-200 p-5 rounded">
                                    <h3 className="font-semibold">Connect your attendees with your event</h3>
                                    <p className="mt-2">Use our live engagement tools to connect with attendees during the event.</p>
                                </div>
                            </>
                        }
                        {
                            steps === "Step-4" &&
                            <>
                                <div className="border border-gray-200 p-5 rounded">
                                    <h3 className="font-semibold">Create multiple sessions & earn more</h3>
                                    <p className="mt-2">Use our event scheduling features to create multiple sessions for your events & earn more money.</p>
                                </div>
                                <div className="border border-gray-200 p-5 rounded">
                                    <h3 className="font-semibold">Clone past event to create similar events</h3>
                                    <p className="mt-2">Use our event cloning feature to clone past event and create a new one easily within a few clicks.</p>
                                </div>
                                <div className="border border-gray-200 p-5 rounded">
                                    <h3 className="font-semibold">Get support like nowhere else</h3>
                                    <p className="mt-2">Our dedicated on-boarding coach will assist you in becoming an expert in no time.</p>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Host