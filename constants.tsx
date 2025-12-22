
import { Driver, Engineer, Sponsor } from './types';

export const INITIAL_FUNDS = 50000000;
export const SEASON_RACES = [
  "Bahrain Grand Prix",
  "Saudi Arabian Grand Prix",
  "Australian Grand Prix",
  "Azerbaijan Grand Prix",
  "Miami Grand Prix",
  "Monaco Grand Prix",
  "Spanish Grand Prix",
  "Canadian Grand Prix",
  "Austrian Grand Prix",
  "British Grand Prix"
];

export const RIVAL_TEAMS = [
  { name: "Red Bull Racing", color: "#0600ef", drivers: ["Max Verstappen", "Sergio Perez"] },
  { name: "Ferrari", color: "#ef1a2d", drivers: ["Charles Leclerc", "Carlos Sainz"] },
  { name: "Mercedes", color: "#00d2be", drivers: ["Lewis Hamilton", "George Russell"] },
  { name: "McLaren", color: "#ff8700", drivers: ["Lando Norris", "Oscar Piastri"] },
  { name: "Aston Martin", color: "#006f62", drivers: ["Fernando Alonso", "Lance Stroll"] },
  { name: "Alpine", color: "#0090ff", drivers: ["Pierre Gasly", "Esteban Ocon"] },
  { name: "Williams", color: "#005aff", drivers: ["Alex Albon", "Logan Sargeant"] },
  { name: "RB Visa", color: "#6692ff", drivers: ["Yuki Tsunoda", "Daniel Ricciardo"] },
  { name: "Haas", color: "#ffffff", drivers: ["Nico Hulkenberg", "Kevin Magnussen"] }
];

export const AVAILABLE_DRIVERS: Driver[] = [
  { id: 'd-senna', name: 'Ayrton Senna', age: 34, nationality: 'Brazil', pace: 99, consistency: 92, marketability: 100, experience: 95, salary: 20000000, cost: 50000000, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SENNA01_Ayrton_Senna/senna01.png' },
  { id: 'd-schumacher', name: 'Michael Schumacher', age: 35, nationality: 'Germany', pace: 98, consistency: 99, marketability: 100, experience: 99, salary: 20000000, cost: 50000000, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SCHMIC01_Michael_Schumacher/schmic01.png' },
  { id: 'd1', name: 'Max Verstappen', age: 26, nationality: 'Netherlands', pace: 96, consistency: 94, marketability: 98, experience: 85, salary: 15000000, cost: 45000000, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png' },
  { id: 'd2', name: 'Sergio Perez', age: 34, nationality: 'Mexico', pace: 87, consistency: 82, marketability: 95, experience: 92, salary: 8000000, cost: 22000000, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png' },
  { id: 'd3', name: 'Lewis Hamilton', age: 39, nationality: 'United Kingdom', pace: 92, consistency: 95, marketability: 99, experience: 99, salary: 18000000, cost: 38000000, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png' },
  { id: 'd4', name: 'George Russell', age: 26, nationality: 'United Kingdom', pace: 89, consistency: 88, marketability: 88, experience: 78, salary: 7000000, cost: 25000000, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png' },
  { id: 'd5', name: 'Charles Leclerc', age: 26, nationality: 'Monaco', pace: 91, consistency: 86, marketability: 94, experience: 80, salary: 12000000, cost: 32000000, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png' },
  { id: 'd6', name: 'Carlos Sainz', age: 29, nationality: 'Spain', pace: 90, consistency: 91, marketability: 90, experience: 88, salary: 9000000, cost: 28000000, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png' },
  { id: 'd7', name: 'Lando Norris', age: 24, nationality: 'United Kingdom', pace: 90, consistency: 88, marketability: 92, experience: 75, salary: 8000000, cost: 28000000, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png' },
  { id: 'd8', name: 'Oscar Piastri', age: 22, nationality: 'Australia', pace: 88, consistency: 87, marketability: 85, experience: 45, salary: 4000000, cost: 18000000, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png' },
  { id: 'd9', name: 'Fernando Alonso', age: 42, nationality: 'Spain', pace: 89, consistency: 92, marketability: 90, experience: 99, salary: 10000000, cost: 24000000, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png' },
  { id: 'd10', name: 'Lance Stroll', age: 25, nationality: 'Canada', pace: 81, consistency: 78, marketability: 75, experience: 72, salary: 3000000, cost: 8000000, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png' },
  { id: 'd14', name: 'Franco Colapinto', age: 21, nationality: 'Argentina', pace: 82, consistency: 80, marketability: 88, experience: 10, salary: 1000000, cost: 3000000, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png' },
  { id: 'd13', name: 'Alex Albon', age: 27, nationality: 'Thailand', pace: 86, consistency: 88, marketability: 80, experience: 68, salary: 3000000, cost: 9000000, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png' },
];

export const AVAILABLE_ENGINEERS: Engineer[] = [
  { id: 'e1', name: 'Adrian Newey', specialty: 'Aero', rating: 99, salary: 10000000, cost: 20000000 },
  { id: 'e2', name: 'James Allison', specialty: 'Aero', rating: 92, salary: 6000000, cost: 12000000 },
  { id: 'e3', name: 'Pierre Waché', specialty: 'Aero', rating: 95, salary: 7500000, cost: 15000000 },
  { id: 'e4', name: 'Hywel Thomas', specialty: 'Engine', rating: 94, salary: 7000000, cost: 14000000 },
  { id: 'e5', name: 'Enrico Cardile', specialty: 'Engine', rating: 88, salary: 4000000, cost: 8000000 },
  { id: 'e6', name: 'Dan Fallows', specialty: 'Reliability', rating: 85, salary: 3000000, cost: 5000000 },
  { id: 'e7', name: 'Andrea Stella', specialty: 'Aero', rating: 89, salary: 5000000, cost: 9000000 },
  { id: 'e8', name: 'Ayao Komatsu', specialty: 'Reliability', rating: 82, salary: 2500000, cost: 4000000 },
];

export const AVAILABLE_SPONSORS: Sponsor[] = [
  { id: 's1', name: 'Velocity Energy', payoutPerRace: 4500000, signingBonus: 5000000, logoColor: 'bg-yellow-500', category: 'Energy Drink', targetPosition: 3 },
  { id: 's2', name: 'Apex Logistics', payoutPerRace: 2800000, signingBonus: 8000000, logoColor: 'bg-blue-600', category: 'Logistics', targetPosition: 10 },
  { id: 's3', name: 'Zenith Watches', payoutPerRace: 5000000, signingBonus: 2000000, logoColor: 'bg-slate-300', category: 'Luxury', targetPosition: 1 },
  { id: 's4', name: 'CyberStream', payoutPerRace: 3200000, signingBonus: 4000000, logoColor: 'bg-purple-600', category: 'Tech', targetPosition: 5 },
];
