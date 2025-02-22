import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Error = () => {
    return (
        <div>
            <Link to='/home'><button className='btn btn-primary m-1'>Back to Home</button></Link>
            <div className='text-center mt-[300px]'>
                <div className='w-full md:w-[500px] lg:h-[500px] mx-auto'>
                    <img className='' src="https://i.ibb.co/PQXhmKJ/404-page-not-found-1024x576.webp" alt="404 Page Not Found" />
                </div>
            </div>
        </div>
    );
};

export default Error;
