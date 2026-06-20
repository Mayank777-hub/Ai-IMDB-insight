"use client"
import React from 'react'
import { Users, MousePointerClick, Clock, radar } from 'lucide-react'
import "../dash.css"
import { Line, Bar,Doughnut } from "react-chartjs-2"
import { useState,useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
const dashboard = () => {
  const InitialState_Data = 
    {
     "India":
     [
      {State:"Maharashtra",Sessions:"150"},
     {State:"Delhi",Sessions:"95"},
     {State:"Uttar Pradesh",Sessions:"162"},
     {State:"Punjab",Sessions:"49"},
     {State:"Hyderabad",Sessions:"230"},
     {State:"Arunachal Pradesh",Sessions:"15"}
     ],                                                       // fall back in case if api not work still chart show some data.
     "Germany":
     [
      {State:"Maharashtra",Sessions:"150"},
     {State:"Delhi",Sessions:"95"},
     {State:"Uttar Pradesh",Sessions:"162"},
     {State:"Punjab",Sessions:"49"},
     {State:"Hyderabad",Sessions:"230"},
     {State:"Arunachal Pradesh",Sessions:"15"}
     ],                                                       // fall back in case if api not work still chart show some data.
     "Canada":
     [
      {State:"Maharashtra",Sessions:"150"},
     {State:"Delhi",Sessions:"95"},
     {State:"Uttar Pradesh",Sessions:"162"},
     {State:"Punjab",Sessions:"49"},
     {State:"Hyderabad",Sessions:"230"},
     {State:"Arunachal Pradesh",Sessions:"15"}
     ],                                                       // fall back in case if api not work still chart show some data.
     "United Kingdom":
     [
      {State:"Maharashtra",Sessions:"150"},
     {State:"Delhi",Sessions:"95"},
     {State:"Uttar Pradesh",Sessions:"162"},
     {State:"Punjab",Sessions:"49"},
     {State:"Hyderabad",Sessions:"230"},
     {State:"Arunachal Pradesh",Sessions:"15"}
     ],                                                       // fall back in case if api not work still chart show some data.
     "United States": [
    { State: "California", Sessions: 210 },
    { State: "Texas", Sessions: 110 },
    { State: "New York", Sessions: 90 }
  ]
    }
  const [selectday,setselectday] = useState('week');
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] =useState("India");
  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Users',
        data: [420, 566, 490, 710, 680, 820, 910],
        borderColor: 'white', // Aqua line
        backgroundColor: 'rgb(218, 194, 14)',
        tension: 0.3,
        pointBackgroundColor: 'yellow',
      },
    ],
  };


  const barData = {
    labels: ['India', 'United States', 'Germany', 'United Kingdom', 'Canada'],
    datasets: [
      {
        label: 'Sessions',
        data: [650, 410, 180, 120, 95],
        backgroundColor: [
          'rgba(255, 255, 0, 0.8)', 
          'rgba(0, 255, 255, 0.8)',
          'rgba(0, 255, 255, 0.6)',
          'rgba(0, 255, 255, 0.4)',
          'rgba(0, 255, 255, 0.2)',
        ],
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

const Donutdata = {
  labels : InitialState_Data[selectedCountry]?.map(item => item.State
  ),
  datasets:[
    {
      label:"Sessions",
    data:InitialState_Data[selectedCountry]?.map(
      item => Number(item.Sessions)
    ),
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 206, 86)",
        "rgb(75, 192, 192)",
        "rgb(153, 102, 255)",
        "rgb(255, 159, 64)",
      ],
  },
  ],
}
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "rgb(255, 255, 255)"
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "rgb(255, 255, 255)"
        },
        grid: {
          color: "rgba(255,255,255,.1)"
        }
      },
      y: {
        ticks: {
          color: "rgb(255, 255, 255)"
        },
        grid: {
          color: "rgba(255,255,255,.1)"
        }
      }
    }
  };

  const horizontalBarOptions = {
    ...chartOptions,
    indexAxis: 'y',
  };
  return <>
    <h1 className='dashhead'>Welcome to Analyzer-Board</h1>
    <div className='upper'>
      <ul>
        <li className='up AUser'>
          <div>Active users</div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <div className='Adata'>566</div>
            <Users size={20} style={{ color: "red" }} />
          </span>
        </li>
        <li className='up Tclicks'>
          <div>Total users</div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <div className='Adata'>1906</div>
            <MousePointerClick size={20} style={{ color: "red" }} />
          </span>
        </li>
        <li className='up Avgt'>
          <div>Active users</div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <div className='Adata'>2m 10s</div>
            <Clock size={20} style={{ color: "red" }} />
          </span>
          <p>Acc to pages</p>
        </li>
        <li className='up Mostv'>
          <div>Most Visited</div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <div className='Adata'>/Search</div>
            <Clock size={20} style={{ color: "red" }} />
          </span>
          <p>Acc to pages</p>
        </li>
      </ul>
    </div>
    <div className='activergeo'>
      <div className='chart-row'>
        <div className='chart-container'>
          <h3 >📈 Active Users Growth</h3>
          <div className='chart-wrapper'>
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        <div className='chart-container'>
          <h3 >🌍 Top 5 Traffic Locations</h3>
          <div className='chart-wrapper'>
            <Bar data={barData} options={horizontalBarOptions} />
          </div>
        </div>
      </div>
    </div>
    <div className="Anapan">
      <h3> User & Traffic Analyzer Panel</h3>
      <button className='viewanalyze' onClick={() => setOpen(!open)}>
          <p style={{color:"black"}}>Analyze</p>
        <span className={`rotaetraff ${open ? 'open' : ''}`} >
          ▼
        </span>

      </button>
      <div className={`analyzecontent ${open ? 'show' : " "}`}>
          <h4>Anaylize Active User:</h4>
        <div className="analyzeday">
            <label htmlFor="day-select">Monitor Active Users : </label>
            <p>Current Year(2026)</p>
             <select
            id="day-select"
            value={selectday}
            onChange={(e) => setselectday(e.target.value)}
          >
            <option value="Week">Week</option>
            <option value="Month">Month</option>
            <option value="Year">Year</option>
          </select>
        </div>
        <div className="display">
          <div className="inner">
          <p>Total Users: 120</p>
          <p>Total Active Users: 120</p>
          <p>High Time Users: 540</p>
          <p>Lowest Time Users: 540</p>
          <p>Avg Time: 3m 20s</p>
        </div>
        </div>

        <div className="country-filter">
            <h4>Anaylize Country Traffic</h4>
          <label htmlFor="country-select">View States For: </label>
          <select
            id="country-select"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="Germany">Germany</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
          </select>
        </div>
        <div className="showdonut">
           <Doughnut
    data={Donutdata}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  }}
      
  />
        </div>
      </div>
    </div>
  </>
}

export default dashboard
