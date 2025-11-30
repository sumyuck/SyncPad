import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';

function App() {
    return (
        <>
            <div>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#3a3a3a',
                            color: '#e5e5e5',
                            border: '1px solid #404040',
                            boxShadow: '0 18px 45px rgba(0, 0, 0, 0.45)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#4caf50',
                                secondary: '#2d2d2d',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#e57373',
                                secondary: '#2d2d2d',
                            },
                        },
                    }}
                ></Toaster>
            </div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route
                        path="/editor/:roomId"
                        element={<EditorPage />}
                    ></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
