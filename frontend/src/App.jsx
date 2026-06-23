import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Login from './Login'
import Signup from './Signup'
import ProfileSetup from './ProfilePictureUpload'
import ProtectedRoute from './ProtectedRoute'
import CreatePost from './CreatePost'
import AppLayout from './AppLayout'
import Feed from './Feed'
import Notifications from './Notifications'
import Profile from './Profile'
import Messages from './Messages'
import Search from './Search'
import EditProfile from './EditProfile'
import Moods from './Moods'
import Mood from './Mood'
import Posts from './Posts'
import StoryViewer from './StoryViewer'
import CreateStatus from './CreateStatus'
import ChatRoom from './ChatRoom'
import SharePost from './SharePost'
import MoodReactions from './MoodReactions'
import Follower from './Follower'
import Following from './Following'
import LikedPosts from './LikedPosts'
import SingleStory from './SingleStory'

function App() {

  return (
    <>
      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/story/:userId"
          element={<ProtectedRoute>
            <StoryViewer />
          </ProtectedRoute>}
        />

        {/* PROFILE SETUP */}

        <Route
          path="/setup-profile"
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          }
        />


        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/story/single/:storyId"
          element={<ProtectedRoute><SingleStory /></ProtectedRoute>}
        />

        <Route
          path="/messages/:conversationId"
          element={
            <ProtectedRoute>
              <ChatRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/share-post/:postId"
          element={<ProtectedRoute><SharePost /></ProtectedRoute>}
        />

        <Route
          path="/follower/:userId"
          element={<ProtectedRoute><Follower /></ProtectedRoute>}
        />
        <Route
          path="/following/:userId"
          element={<ProtectedRoute><Following /></ProtectedRoute>}
        />

        <Route
          path="/liked-posts"
          element={<ProtectedRoute><LikedPosts /></ProtectedRoute>}
        />

        <Route
          path="/moods/reactions/:moodId"
          element={<MoodReactions />}
        />



        {/* PROTECTED APP ROUTES */}

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/mood/:mood"
            element={
              <Mood />
            }
          />

          {/* FEED */}

          <Route
            path="/feed"
            element={<Feed />}
          />

          {/* CREATE POST */}

          <Route
            path="/create-post"
            element={<CreatePost />}
          />




          {/* NOTIFICATIONS */}

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          {/* PROFILE */}

          <Route
            path="/profile/:profile"
            element={<Profile />}
          />

          {/* MESSAGES */}

          <Route
            path="/messages"
            element={<Messages />}
          />

          {/* SEARCH */}

          <Route
            path="/search"
            element={<Search />}
          />

          <Route
            path="/moods"
            element={<Moods />}
          />

          <Route
            path="/posts/:id"
            element={<Posts />}
          />

          <Route
            path="/create-story"
            element={<CreateStatus />}
          />

        </Route>

        {/* FALLBACK */}

        <Route
          path="*"
          element={
            <Navigate to="/feed" />
          }
        />

      </Routes>
    </>
  )
}

export default App
