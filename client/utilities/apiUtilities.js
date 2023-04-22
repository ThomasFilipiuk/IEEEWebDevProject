export async function getData(query) {
    try {
      // console.log(`query: http://localhost:3000/${query}`);
      const response = await fetch(`http://localhost:3000/${query.toLowerCase()}`, {'headers': {'Content-type': 'application/json'}});      
      const contentType = response.headers.get('content-type');      
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

export async function postData(endpoint, body) {
  try {
    const response = await fetch(`http://localhost:3000/${endpoint}`, {
      method: 'POST',
      // headers: {
      //   'Content-Type': contentType
      // },
      
      body: body,
      
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Review data has been posted successfully:', data);
    return data;

  } catch (error) {
    console.error('Error posting review data:', error);
  }
}
  