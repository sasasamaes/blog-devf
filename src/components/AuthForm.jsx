import { useState } from 'react';
import { supabase } from '../utils/supabase';


//auth email y password con supabase auth
export default function AuthForm( { session, setSession }) {
    const user = session?.user ?? null;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [mode, _setMode] = useState('login'); // 'login' or 'signup'

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });

                if (error) throw error;
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setMessage('Logged in successfully!');
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage('Signed up successfully! Please check your email to confirm.');
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        setLoading(true);
        setError(null);
        setMessage('');
        try {
            const { error } = await supabase.auth.signOut();

            if (error) throw error;
            setSession(null);
            setMessage('Logged out successfully!');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    if (user) {
        return (
            <div>
                <p>Welcome, {user.email}</p>
                <button onClick={handleLogout} disabled={loading}>
                    {loading ? 'Logging out...' : 'Logout'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {message && <p style={{ color: 'green' }}>{message}</p>}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : mode === 'login' ? 'Login' : 'Sign Up'}
            </button>
        </form>
    )

}