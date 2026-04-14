import { useState } from 'react';
import { authAPI } from '../services/api';

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        otp: ''
    });
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (step === 1) {
                await authAPI.sendOTP(form.email);
                alert('OTP sent to email');
                setStep(2);
            } else {
                const res = await authAPI.register(
                    form.name,
                    form.email,
                    form.password,
                    form.role,
                    form.otp
                );
                localStorage.setItem('token', res.data.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.data.user));
                alert('Registration successful');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                {step === 1 ? (
                    <>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <select
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                        >
                            <option value="student">Student</option>
                            <option value="lecturer">Lecturer</option>
                        </select>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={form.otp}
                            onChange={(e) => setForm({ ...form, otp: e.target.value })}
                            required
                        />
                    </>
                )}

                {error && <p>{error}</p>}

                <button type="submit">
                    {step === 1 ? 'Send OTP' : 'Verify & Register'}
                </button>
            </form>

            <p>
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    );
}