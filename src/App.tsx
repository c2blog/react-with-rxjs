import React from 'react';
import logo from './logo.svg';
import './App.css';
import { usePostService } from './service/post.service';

/** CRA application component. */
const App: React.FC = () => {

  /** Use the PostService. */
  const {posts, service:{getPosts}} = usePostService();

  /** Fetch the posts. */
  React.useEffect(() => {
    getPosts()
      .then(posts => console.log(posts))
      .catch(err => console.error(err))
  }, [getPosts])

  return (
    <div className="App">
      {posts.map(post => {
        <div key={post.id}>{post.title}</div>
      })}
    </div>
  );
}
export default App;
