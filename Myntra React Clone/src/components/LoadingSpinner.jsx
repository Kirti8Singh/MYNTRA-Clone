const LoadingSpinner = () => {
  return (
    <div className='d-flex justify-content-center spinner'>
      <div
        className='spinner-border text-danger'
        style={{ width: "3.5rem", height: "3.5rem" }}
        role='status'
      >
        <span className='visually-hidden'>Loading Skincare Products...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
