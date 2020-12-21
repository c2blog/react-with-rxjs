import React from 'react';
import {BehaviorSubject} from 'rxjs';

/** The post service state. */
export interface PostServiceState {
  count: number;
  posts: any[];
}
/** Partial state so can updated state without having to provide all fields. */
export type PostServiceStatePartial = Partial<PostServiceState>;

/** Sample posts. */
const samplePosts = [{
  id: 1,
  title: 'Welcome to React with RxJS'
}, {
  id: 2,
  title: 'More fun stuff...'
}]

/** The post service class. */
export class PostService {
  /** The state subject. */
  private readonly _state$: BehaviorSubject<PostServiceState>;

  /** Gets the state subject. Not typically used but made available for advanced usages. */
  get state$() {return this._state$}

  /** The instance field. */
  private static _current: PostService;
  /** Get the current instance. This pattern is only needed if the service is a singlton. */
  static current(): PostService {
      if (!PostService._current) PostService._current = new PostService();
      return PostService._current;
  }

  /** Get the current state. */
  getState = (): Readonly<PostServiceState> => this.state$.getValue();
  /** Set the state and notify all subscribers. */
  setState = (state: PostServiceStatePartial) => this.state$.next({...this.getState(), ...state});

  /** Get a post using it's id. If the post is already in state return, otherwise, simulate an async call to get the post and load into state. */
  getPost = async (id: number) => {
    return new Promise(resolve => {
      const {posts} = this.getState();
      // Try to get post from state
      const post = posts.find(post => post.id === id);
      // If posts already in state, return.
      if (post) return resolve(post);


      // Simulate async call
      setTimeout(() => {
        const post = samplePosts.find(post => post.id === id);
        const posts = [...this.getState().posts, post];
        this.setState({posts});
        resolve(post);
      }, 1000);
    });
  }

  /** Get all posts. This simulates a async call to get all posts and load into state. */
  getPosts = () => {
    return new Promise(resolve => {
      // Simulate async call
      setTimeout(() => {
        this.setState({count: samplePosts.length, posts: samplePosts});
        resolve(samplePosts);
      }, 1000);
    });
  }

  /** Create instance of PostService. */
  private constructor() {
    this._state$ = new BehaviorSubject<PostServiceState>({
        count: -1, posts: []
    });
  }
}

/** Post service hook. */
export const usePostService = () => {
  /** Initialize the hook state. */
  const [state, setState] = React.useState(PostService.current().getState());

  React.useEffect(() => {
    /** Subscribe to the subject. */
    const o = PostService.current().state$.subscribe(setState);
    /** Cleanup when hook no longer needed. */
    return () => {o.unsubscribe()}
  }, [])

  return {
      ...state,
      service: PostService.current()
  };

}