export async function getData(query) {
    try {
      const response = await fetch(`http://localhost:3000/${query}`, {'headers': {'Content-type': 'application/json'}});
      const contentType = response.headers.get('content-type');
  
      const json = await response.text();
      console.log(json);
      return json;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

export async function postReviewData(endpoint, postData) {
    try {
      const response = await fetch(`http://localhost:3000/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Review data has been posted successfully:', data);
    } catch (error) {
      console.error('Error posting review data:', error);
    }
  }
  