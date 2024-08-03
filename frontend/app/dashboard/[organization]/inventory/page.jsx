"use client"; 

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEllipsisV, faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import './styles.css'; 
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';

const Headquarters = () => {
  return (
    <div className="card">
      <h2>Headquarters</h2>
      <table>
        <tbody>
          <tr>
            <td><button className="edit-button"><FontAwesomeIcon icon={faPen} /></button></td>
          </tr>
          <tr>
            <td><button className="edit-button"><FontAwesomeIcon icon={faPen} /></button></td>
          </tr>
          <tr>
            <td><button className="edit-button"><FontAwesomeIcon icon={faPen} /></button></td>
          </tr>
          <tr>
            <td><button className="edit-button"><FontAwesomeIcon icon={faPen} /></button></td>
          </tr>
        </tbody>
      </table>
      <button className="add-button"><FontAwesomeIcon icon={faPlus} /></button>
    </div>
  );
};

const Inventory = () => {
  return (
    <div className="card">
      <h2>Storage</h2>
      <table>
        <thead>
          <tr>
            <th>Options</th>
            <th>Products</th>
            <th>Units</th>
            <th>Expiration</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className="icon-button">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <button className="add-button"><FontAwesomeIcon icon={faPlus} /></button>
    </div>
  );
};

const History = () => {
  return (
    <div className="card">
      <h2>History</h2>
      <ul className="history-list">
        <li>
        </li>
        <li>
        </li>
        <li>
        </li>
        <li>
        </li>
      </ul>
    </div>
  );
};

const Page = () => {
  return (
    <Layout>
      <BreadcrumbItem mainTitle="Resource Management" subTitle="Inventory" />
      <div className="container">

        <div className='row'>
          <div className="col-md-6">
            <Headquarters />
            <History />
          </div>
          <div className="col-md-6">
            <Inventory />
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
