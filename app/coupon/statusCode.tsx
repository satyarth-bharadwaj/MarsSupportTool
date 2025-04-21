const getStatusColor = (statusCode:string|null) => {
    switch (statusCode) {
      case "200":
        return 'green';
      case "401":
        return 'orange';
      default:
        return 'red';
    }
  };
  export default getStatusColor;