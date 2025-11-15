import { useEffect } from 'react';

const AdminLoginPage = () => {
  useEffect(() => {
    // Redirect to Django Admin after the component is mounted
    // Redirect to Django Admin
      //This will only work on laptop , if react app is running on mobile , it will not work, then we need to expose port 8000 to internet
      //in that scenario we can do 2 things:
      //1) Host react frontend on internet using vercel or netlify and host django backend on ngrok and update all the API urls in the frontend
      //2) Host both react and django using ngrok and update all the API urls in the frontend ( this will be easier but PAID)
      //we will go with option later
    window.location.href = 'http://127.0.0.1:8000/admin/';
  }, []);

  return <div>Redirecting to admin...</div>
 
  
};

export default AdminLoginPage;
