"use client";
import { useEffect, useState } from 'react';
import styles from "./achievements.module.css";
import Chart from 'chart.js/auto';
import Container from '@/app/components/Container';

const Achievements = () => {
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const statsSection = document.querySelector(".stats")
        const numbers = document.querySelectorAll(`.${styles.number}`);

        const handleScroll = () => {
            if (window.scrollY >= 1690.4176025390625) {
                if (!started) {
                    numbers.forEach((num) => startCount(num ));
                }
                setStarted(true);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [started]);

    const startCount = (el) => {
        const goal = parseInt(el.dataset.goal || '0');
        let current = 0;

        const countInterval = setInterval(() => {
            current += 1;
            el.textContent = current.toString();
            if (current === goal) {
                clearInterval(countInterval);
            }
        }, 3000 / goal);
    };

    return (
        <div className={`${styles.stats}`}>
            <h2 className={styles.specialHeading}>Our achievements</h2>
            <Container>
                <div className={`${styles.containerBox}`}>
                    <div className={`${styles.box}`}>
                        <div className={`${styles.countBox}`}>
                            <div className={`${styles.number}`} data-goal="85">0</div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="30" height="30">
                                <path
                                    d="M374.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-320 320c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l320-320zM128 128A64 64 0 1 0 0 128a64 64 0 1 0 128 0zM384 384a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"
                                    fill="url(#gradient)" />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                                        <stop offset="40%" stopColor="#afbbff" />
                                        <stop offset="80%" stopColor="#d9a755" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <p>Happy and satisfied customers</p>
                    </div>
                    <div className={`${styles.box}`}>
                        <div className={`${styles.countBox}`}>
                            <div className={`${styles.number}`} data-goal="85">0</div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="30" height="30">
                                <path
                                    d="M374.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-320 320c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l320-320zM128 128A64 64 0 1 0 0 128a64 64 0 1 0 128 0zM384 384a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"
                                    fill="url(#gradient)" />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                                        <stop offset="40%" stopColor="#afbbff" />
                                        <stop offset="80%" stopColor="#d9a755" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <p>Happy and satisfied customers</p>
                    </div>
                    <div className={`${styles.box}`}>
                        <div className={`${styles.countBox}`}>
                            <div className={`${styles.number}`} data-goal="85">0</div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="30" height="30">
                                <path
                                    d="M374.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-320 320c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l320-320zM128 128A64 64 0 1 0 0 128a64 64 0 1 0 128 0zM384 384a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"
                                    fill="url(#gradient)" />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                                        <stop offset="40%" stopColor="#afbbff" />
                                        <stop offset="80%" stopColor="#d9a755" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <p>Happy and satisfied customers</p>
                    </div>
                </div>
                <MyChart />
            </Container>
        </div>
    );
};
export default Achievements;

export function MyChart() {
    useEffect(() => {
        const canvas = document.querySelector('#myChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const gradient = ctx.createLinearGradient(120, 5, 110, 20);
        gradient.addColorStop(0, '#ff8800');

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
                datasets: [{
                    label: 'Sales in 2024',
                    data: [12, 22, 20, 31, 35, 45, 50, 63, 68, 77, 85, 87, 90, 92],
                    borderColor: gradient,
                    backgroundColor: gradient,
                    fill: false,
                    pointBackgroundColor: '#d9a755',
                    borderWidth: 3,
                    pointBorderWidth: 6,
                    pointHoverRadius: 9,
                    pointHoverBorderWidth: 8,
                    pointHoverBorderColor: 'rgb(74,85,104)',
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Selling Overview',
                        position: 'top',
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            font: {
                                size: 18,
                            },
                        },
                        grid: {
                            display: true,
                            color: '#e8eaed',
                        },
                    },
                    y: {
                        ticks: {
                            min: 0, 
                            callback: (value) => value + '%',
                        },
                        grid: {
                            display: true,
                            color: '#e8eaed',
                        },
                    },
                },
            },
        });

        return () => {
            chart.destroy();
        };
    }, []);

    return (
        <>
            <canvas className={`${styles.MyChart}`} id="myChart"
                style={{ width: '100%', height: '400px', margin: 'auto' }}>
            </canvas>
        </>
    );
}
