import React from 'react';
import { useParams } from 'react-router-dom';

const BomsProductDetailsPage = ({ match }) => {
    const { id } = useParams();

  // Code để hiển thị chi tiết của BOM
  return (
    <div>
      <h1>Chi tiết BOM {id}</h1>
      {/* Nội dung chi tiết của BOM */}
    </div>
  );
};

export default BomsProductDetailsPage;