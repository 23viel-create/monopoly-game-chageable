import { useState, useEffect } from "react";
import axios from 'axios';

function App(){
  //פונקציה וערך שיחזיקו את התשובה שנקבל מהשרת ויעדכנו את זה בהתאם
  const [dbStatus, setDbStatus]= useState(null);

  //פונקציה שתיפעל ברגע שהדף עולה לאוויר
  useEffect(()=>{
    //פונקציה א-סיכרונית שתבצע את הבקשה
    const checkConnection= async()=>{
      try{
        //שליחת בקשה לכתובת של השרת שבנינו
        const response =await axios.get('http://localhost:5000/api/test-db');

        //
        setDbStatus(response.data);
      }catch(error){
        //
        console.error("Error connecting to server:", error);
        setDbStatus({message: "Error connecting to server", time:null})
      }
    };
    //
    checkConnection();
  },[]);

  //
  return(
    <div style={{
      textAlign: 'center',
      marginTop: '50px',
      fontFamily: "Ariel"}}>
      <h1>Monopoly Birthday Game!</h1>
      <div style={{
        padding:'20px',
        border: '1px solid #ccc',
        display:'inline-block',
        borderRadius: '10px'
      }}>
      <h2>Server Status:</h2>
      {dbStatus ?(
        <div>
          <p style={{
            color: 'green',
            fontWeight: 'bold'
            }}>
              {dbStatus.message}
          </p>
          <p>Server Time: {dbStatus.time}</p>
        </div>
      ):(
        <p>Loading...</p>
      )}
      </div>
    </div>
  );
}

export default App;