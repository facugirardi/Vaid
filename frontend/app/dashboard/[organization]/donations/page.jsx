"use client";

import React from 'react';
import './donation.css';
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';

const BuySell = () => {
  return (
  <div className="container">
  <div className="cards-container">
  <div className="card">
  <div className="card-header">
    <h3>Buy and Sell</h3>
    <button className="add-button">+</button>
  </div>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Units</th>
        <th>Date</th>
        <th>Time</th>
        <th>Operation</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><button className="options-button"><i className="fas fa-ellipsis-v"></i></button></td>
      </tr>
      <tr>
        <td><button className="options-button"><i className="fas fa-ellipsis-v"></i></button></td>
      </tr>
      <tr>
        <td><button className="options-button"><i className="fas fa-ellipsis-v"></i></button></td>
      </tr>
      <tr>
        <td><button className="options-button"><i className="fas fa-ellipsis-v"></i></button></td>
      </tr>
      <tr>
        <td><button className="options-button"><i className="fas fa-ellipsis-v"></i></button></td>
      </tr>
    </tbody>
  </table>
</div>
</div>
</div>)
}

const Donations = () => {
  return (
    <div className="container">
      <div className="cards-container">
        <div className="card">
          <div className="card-header">
            <h3>Donations</h3>
            <button className="add-button">+</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Units</th>
                <th>Income Date</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><button className="options-button"><i className="fas fa-ellipsis-v"></i></button></td>
              </tr>
              <tr>
                <td><button className="options-button"><i className="fas fa-ellipsis-v"></i></button></td>
              </tr>
              <tr>
                <td><button className="options-button"><i className="fas fa-ellipsis-v"></i></button></td>
              </tr>
              <tr>
                <td><button className="options-button"><i className="fas fa-ellipsis-v"></i></button></td>
              </tr>
              <tr>
                <td><button className="options-button"><i className="fas fa-ellipsis-v"></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const Page = () => {
  return (
    <Layout>
      <BreadcrumbItem mainTitle="Resource Management" subTitle="Operations" />
      <div className="container">

        <div className='row'>
          <div className="col-md-6">
            <Donations /> 
          </div>
          <div className="col-md-6">
            <BuySell /> 
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
