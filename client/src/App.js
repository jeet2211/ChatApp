import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';

// Layout component
const Layout = ({ children }) => (
  <div>
    {/* You can add header, footer, or any other layout components here */}
    {children}
  </div>
);

const App = () => (
  <Router>
    <Routes>
      <Route
        path="/"
        element={(
          <Layout>
            <Join />
          </Layout>
        )}
      />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  </Router>
);

export default App;
