import { useEffect, useState } from 'react';
import './App.css'
import { binanceLogo, dailyCipher, dailyCombo, dailyReward, dollarCoin, hamsterCoin, mainCharacter } from './images';
import Hamster from './icons/Hamster'
import Info from './icons/Info.tsx';
import Settings from './icons/Settings.tsx';
import Mine from './icons/Mine.tsx';
import Friends from './icons/Friends.tsx';
import Coins from './icons/Coins.tsx';


function App() {

  const levelNames = [
    "Bronze", // from 0 to 4999 coins
    "Silver", // from 5000 coins to 24,999 coins
    "Gold", // from 25,000 coins to 99,999 coins
    "Platinum", // from 100,000 coins to 999,999 coins
    "Diamond", // from 1,000,000 coins to 2,000,000 coins
    "Epic", // from 2,000,000 coins to 10,000,000 coins
    "Legendary", // from 10,000,000 coins to 50,000,000 coins
    "Master", // from 50,000,000 coins to 100,000,000 coins
    "Grandmaster", // from 100,000,000 coins to 1,000,000,000 coins
    "Lord" // from 1,000,000,000 coins to ♾
  ];

  const levelMinPoints = [
    0,            // Bronze
    5000,         // Silver
    25000,        // Gold
    100000,       // Platinum
    1000000,      // Diamond
    2000000,      // Epic
    10000000,     // Legendary
    50000000,     // Master
    100000000,    // GrandMaster
    1000000000    // Lord
  ];

  const [levelIndex, setLevelIndex] = useState(6); {/* defining a state variable 'levelIndex' with an initial value of six using the use state hook (зацепить) the levelIndex with an initial value of '6' using the 'useState' hook the level index variable holds the current level index of the user*/}
  const [points, setPoints] = useState(22749365); {/* defined a state variable 'points' with initial value of 22 mln , using the 'useState()' hook the 'points' varibale holds the current number of points the user has accumulated (накопленный), and the 'setPoints' function is used to update this value */}
  const [clicks, setClicks] = useState<{ id: number, x:number, y: number}[]> //this state holds an array of objects: each representing a click event with properties "id" 'x' and 'y' to track the click's position and unique identifier
  ([]);
  const pointsToAdd = 11; //this representing the number of points added per click
  const profitPerHour = 126420; // this constant represents the number of points the user earn per hour in the app

  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState(""); //this is for tracking the remaining time for daily events` dailyRewardsTimeLeft , dailyCipherTimeLeft , dailyComboTimeLeft
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  const calculateTimeLeft = (targetHour: number) => { //this function computes the remaining time until a specified targer hour in UTC.
    const now = new Date(); //we get current date & time
    const target = new Date(now); // this is set to the current date & time
    target.setUTCHours(targetHour, 0, 0, 0); //then adjust the 'target' to the target hour ; ''' ADJUST TARGET DATE IF NEEDED '''

    if (now.getUTCHours() >= targetHour) { // if the current hour is past the target hour, the target date is incremented by one day
      target.setUTCDate(target.getUTCDate() + 1);
    }
    const diff = target.getTime() - now.getTime(); //calculates time difference, which is the difference in miilliseconds between the target and current times

    if (diff < 0) {
      return "00:00"; // или какое-то другое значение по умолчанию 
    }
    const hours = Math.floor(diff / (1000 * 60 * 60)); //it calculates from the time difference, then format hours
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));// it calculates from the time difference, then format minutes

    const paddedHours = hours.toString().padStart(2, '0'); // it ensures two digit formatting, then we return time string
    const paddedMinutes = minutes.toString().padStart(2, '0'); // it ensures two digit formatting, then we return time string

    return `${paddedHours}:${paddedMinutes}`; //  then the function returns the remaining time as a formatted string 
    }

const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => { // 
  const card = e.currentTarget; // we get the clicked card
  const rect = card.getBoundingClientRect(); // and its dimensions
  const x = e.clientX - rect.left - rect.width / 2; // we calculate the click position
  const y = e.clientY - rect.top - rect.height / 2; // we calculate the click position
  card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`; // we apply a 3D transform to the card 
  setTimeout(() => {
    card.style.transform = '';
  }, 100);

  setPoints(points + pointsToAdd); //update points and clicks state
  setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY}]);
}

const handelAnimationEnd = (id: number) => { //this func performs (выполняет) the following actions, takes an id parameter of type number, update the state variable 'clicks' by filtering out the 'click' object with the matching id.
  setClicks((prevClicks) => prevClicks.filter(click => click.id !== id)); //This ensures that the click animation is removed from the state once it has finished
};

useEffect(() => { // this 'useEffect()' hook for updating countdowns for daily events
  const updateCountdowns = () => {  // this function updates the 'dailyRewardTimeLeft', 'dailyCipherTimeLeft', 'dailyComboTimeLeft' state variables` using 'calculateTimeLeft()' for different target hours
    setDailyRewardTimeLeft(calculateTimeLeft(0));
    setDailyCipherTimeLeft(calculateTimeLeft(19));
    setDailyComboTimeLeft(calculateTimeLeft(12));
  };

  updateCountdowns(); // the for initial (первоначальный) update we immediately call 'updateCountdownds' to set the initial countdowns when the component mounts (монтируется, устанавливается)
  const interval = setInterval(updateCountdowns, 60000); // Update every minute ; set up the interval to call update countdowns every minute to keep the countdowns updated

  return () => clearInterval(interval); //and clean up the interval ; we return the cleanup function function to clear the interval when the component unmounts (размонтировать , отключать) ` preventing memory leaks
}, []);

  const calculateProgress = () => { // the function calculates the user's progress towards the next level ; it returns the minimum value between the calculated progress and 100 to ensure the progress does not exceed 100% 
    if (levelIndex >= levelNames.length - 1) { // if the user at the highest level; if 'levelIndex' is greater than or equal to the index of the last level
      return 100; // indicating, that the user has reached or surpassed the highest level
    }
    const currentLevelMin = levelMinPoints[levelIndex]; //it holds the minimum points required for the current level
    const nextLevelMin = levelMinPoints[levelIndex + 1]; // it holds the minimum points required for the next levele
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100; //it calucated by subtracting 'currentLevelMin' from 'points' ` dividing by the difference between 'nextLevelMin' and 'currentLevelMin', and multiplied by 100 to get a percentage . This ensures the progress does not exceed 100 percent
    return Math.min(progress, 100);
  }

  const formatProfitPerHour = (profit: number) => { // this function formats a numeric profit value into a more readable string representation with appropriate units ; it converts karge profit values into a more readabel format with appropriate units (b for billion, m for million, k for thousands)
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`; //if the profit greater than or equal to 1 billion it divides the profit by 1 billion and appends m for billion , and etc.
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  }

  useEffect(() => {//this hook is for handling the level progression logic based on the current points. This ensures the level is recalculated (пересчитанный) , whenever (всякий раз, когда) any of these values are updated
    const currentLevelMin = levelMinPoints[levelIndex]; //here we retrieve (извлечь) the minimum points required for the current level 
    const nextLevelMin = levelMinPoints[levelIndex + 1]; // we also retrieve (извлечь) the minimum points required for the next level
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) { // if the current points are greater than or equal to the points, that required for the next level, and the current level index is less than the maximum level index, we increase the level index by 1 , effectively leveling up (эффективно выравнимая уровень)
      setLevelIndex(levelIndex - 1);
    }
    else if (points < currentLevelMin && levelIndex > 0) { // if the current points are less than the minimum points, that required for the current level, and the current level index is greater, than 0 , we decrease the level index by 1 , effectively leveling down (эффективно выравнивая) 
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]); //this hook runs whenever (всякий раз, когда) 'points' , 'levelIndex' , 'levelMinPoints', or 'levelNames.lenght' change.

  useEffect(() => { // this hook returns a cleanup function (функция отчистки), that clears the interval, when the component is unmounted (отключен, размонтирован) or when 'profitPerHour'  changes: this is done, using clear interval
    const pointsPerSecond = Math.floor(profitPerHour / 3600); //calculate the number of points to add per second by dividing profit per hour by 3600 and rounding down using 'Math.floor()' function
    const interval = setInterval(() => { //set up the interval that runs every one second using 'setInterval()' function
      setPoints(prevPoint => prevPoint + pointsPerSecond); //call this function to update the points state (состояние) 
    }, 1000); //we use the function form 'setPoints()' to access the previous state 'prevPoints'  and add points per second to it

    return () => clearInterval(interval);
  }, [profitPerHour]); //the dependency (зависимость) 'profitPerHour' ensures that the 'useEffect()' runs initially (первоночально) and whenever (всякий раз, когда) the 'profitPerHour' changes

  return (
    <div className="bg-black flex justify-center"> {/* bg-black - sets the background color to black, flex - enables flexbox layout for the div, justify-center - centers the child elements horizontally within the div */}
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl"> { /* w-full - set the width to 100% of the parent element, h-screen - sets the height to 100% of the viewport height, flex-col - arranges the cild elements in a vertical columnt, max-w-xl - sets the maximmum width to 36 rem /* 576px */ }

        <div className="px-4 z-10"> {/* px-4 - adds horizontal padding of one rem on both sides, z-10 = sets the z index to 10; ensuring this element is layered above elements with a lower z index */ }

          <div className="flex items-center space-x-2 pt-4"> {/* items-center - vertically centers the the child elements within the div , space-x-2 - adds horizontal space of 0.5 frame berween child elements , pt-4 - adds top padding of one rem */}
            <div className="p-1 rounded-lg bg-[#1d2025]"> {/* p1 = adds padding 0.25 frame on all sides, rounded-lg = applies large roundede corners to the element, bg = sets the backround color to a specific dark shade */}
              <Hamster size={24} className="text-[#d4d4d4]" />
            
              <div>
                <p className="text-sm">Nikandr (CEO)</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-4 mt-1"> {/* items-center - vertically centers the child elements within the div, justify-between - distributes (распределяет) space  between the child elements ; pushing them to opposite ends of the div, space-x-4 - adds horizontal space of one rem between child elements, mt-1 - adds a top margin of 0.25 frame */}
            <div className="flex items-center w-1/3"> {/* w-1/3 - sets the width of the div to 1/3 of the parent container */}
              <div className="w-full"> {/* w-full - sets the width of the div to 100% of the parent container*/}
                  <div className="flex justify-between">
                    <p className="text-sm">{levelNames[levelIndex]}</p> {/* text-sm - sets the text size too small ; it displays the current level name from the level names array using the 'levelIndex' state variable */}
                    <p className="text-sm">{levelIndex + 1} <span className="text-[#95908a]">/ {levelNames.length}</span></p> {/* this displays the current 'levelIndex' incremented by '1' to be user friendly and the total number of levels ; inside this <p> ,  a <span> element sets the text color to a specific gray shade, displaying the total number of levels */}
                  </div>
                  <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">  {/* mt-1 - adds a top margin of 0.25 frame, border-2 - adds a two pixel border around the div, border-[#43433b] - sets the border coloer to a specific dark shade, rounded full - applies fully rounded corners to the div */}
                    <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">  {/* w-full - sets the width to 100% of the parent container, h-2 - sets the height to 0.5 fraame, bg-[#43433b] - sets the background color to specific dark shade with 60% opacity (непрозрачность), rounded-full - applies fully rounded corners to the div */}
                      <div className="progress-gradient h-2 rounded-full" style={{width: `${calculateProgress()}%`}}></div> {/* progress-gradient - applies the progress gradient css class, h-2 - sets the height to 0.5 frame, rounded-full - applies fully rounded corners to the div, style - sets the width dynamically based on the calcualte progress function's return value representing the user's progress towards (в направлении) the next level*/}
                    </div>
                  </div>
              </div>
            </div>
            <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64"> {/* w-2/3 - sets the width to 2/3 of the parent container, border-2 - adds a two pixel border around the div, px-4 - adds horizontal padding of one rem on both sides, py-[2px] - adds vertical padding of two pixels on both sides max-w-64 - sets the maximum width to 16 rem */}
              <img src={binanceLogo} alt="Exchange" className="w-8 h-8" /> {/* alt - alternative text for the image, w-8 and h-8 - sets width and height of the image to 2 rem*/}
              <div className="flex-1 text-center"> {/* flex-1 - allows the div to grow and take up the available space within its flex container */}
                <p className="text-xs text-[#85827d] font-medium">Profit per hour</p> {/* text-xs - sets the text size to extra small  */}
                <div className="flex items-center justify-center space-x-1"> {/* space-x-1 - adds horizontal space of 0.25 rem between child elements */}
                  <img src={dollarCoin} alt="Dollar Coin" className="w-[18px] h-[18px]" />
                  <p className="text-sm">{formatProfitPerHour(profitPerHour)}</p> {/* text-sm -sets text size to small, and it contains the result of the 'formatProfitPerHour' function which formats the profit per hour */}
                  <Info size={20} className="text-[#43433b]" /> {/* size = {20} - sets the sizez of the info component to 20 pixels */}
                </div>
              </div>
              <Settings className="text-white" />
            </div>
          </div>

        </div>
        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0"> {/* flex-grow - allows the div to grow and take up the available space within its flex container  , mt-4 - adds a margin top of one rem, rounded-t-[48px] - runs (обводит) the top corners of the div with a radius of 48 pixels relative - positions the div relatie to its normal position, top-glow - applies the top-glow CSS class, which adds a glowing effect at the top , z-0 - sets the z index to zero placing the div at the base staking level (уровень размещения)*/}
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]"> {/* absolute - positions the div absolutely within its containing element, top-[2px] - sets the top position to two pixels from the top of the containing element, left-0 right-0 and bottom-0 - sets the left, right and bottom positions (устанавливает) to zero stretching (растягивая) the div to fill the containing element horizontally and extend to the bottom (простирался до самого низа), rounded-t-[46px] - rounds the top corners of the div with a radius of 46 pixels*/}
              <div className='="px-4 mt-6 flex justify-between gap-2'> {/* px-4 - adds padding of one rem on the left and right sides , mt-6 - adds a margin top of 1.5 rem , justify-between - distributes space between child elements placing them at the start and end of the container, gap-2 - adds a gap (разрыв) of 0.5 rem between child elements*/}
                <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative"> {/* rounded-lg - applies large rounded corners to the div , px-4 - adds padding of one rem on the left and right sides , py-2 - adds padding  of 0.5 rem on the top and bottom , w-full - sets the width to 100% relative - sets the positioning to relative */}
                  <div className="dot"></div> {/* here defined the div with 'dot' class to display a blinking dot */}
                  <img src={dailyReward} alt="Daily Reward" className="mx-auto w-12 h-12" /> {/* mx-auto - centers the image horizontally, that we see in its container */}
                  <p className="text-[10px] text-center text-white mt-1">Daily reward</p> {/* mt-1 - adds a margin top of 0.25 frame */}
                  <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyRewardTimeLeft}</p> {/* m-2 - adds a margin top of 0.5 ram */}
                </div>

                <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                  <div className="dot"></div>
                  <img src={dailyCipher} alt="Daily Cipher" className="mx-auto w-12 h-12" />
                  <p className="text-[10px] text-center text-white mt-1">Daily cipher</p>
                  <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyCipherTimeLeft}</p>
                </div>

                <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                  <div className="dot"></div>
                  <img src={dailyCombo} alt="Daily combo" className="mx-auto w-12 h-12" />
                  <p className="text-[10px] text-center text-white mt-1">Daily combo</p>
                  <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyComboTimeLeft}</p>
                </div>

              </div>

              <div className="px-4 mt-1 flex justify-center">
                  <div className="px-4 py-2 flex items-center space-x-2"> {/* space-x-2 - adds a horizontal space of 0.5 rem between child elements */}
                    <img src={dollarCoin} alt="Dollar coin" className="w-10 h-10" />
                    <p className="text-4xl text-while">{points.toLocaleString()}</p> {/* text-4xl - sets the text size 36px, {point.toLocaleString} - displaya the 'points' state variable formatted as a 'localized string' */}
                  </div>
                </div>

              <div className="px-4 mt-4 flex justify-center">
                <div className="w-80 h-80 p-4 rounded-full circle-outer" onClick={handleCardClick}> {/* p-4 - adds the padding of 1 rem on all sides, rounded-full - applies full rounding to create a circular shape, circle-outer - applies custom styles defined in the '.cicrle-outer' CSS class , 'onClick={handleCardClick}' - attaches an 'event handler' to the div to handle click events*/}
                  <div className="w-full h-full rounded-full circle-inner"> {/* circle-inner - applies custom styles defined in the '.circle-inner' CCS class*/}
                    <img src={mainCharacter} alt="Main Character" className="w-full h-full" />
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs"> {/* fixed - fixes the element to the specified position, which relative to the viewport, bottom-0 - positions the element at the bottom of the viewport left-1/2 - positions the element at the horizontal 'center' of the viewport, ' transform - translate-x-1/2 ' - translates (переместить) the element to the left 50% of its width to center it, ' w-[calc(100%-2rem)] ' - sets the width to full viewport width '- 2rem' , max-w-xl - sets the maximum width to 36rem , justify-around - distributes space around the child elements, placing them evenly (равномерно) within the container , z-50 - sets the z index to 50 making sure the element appears (появляется) above other content , text-xs - makes font size extra small */}
        <div className="text-center text-[#85827d] w-1/5 bg-[#1c1f24] m-1 p-2 rounded-2x1">
          <img src={binanceLogo} alt="Exchange" className="w-8 h-8 mx-auto" /> {/* mx-auto - centers the image horizontally within its container */}
          <p className="mt-1">Exchange</p>

        
        </div>
        <div className="text-center text-[#85827d] w-1/5">
          <Mine className="w-8 h-8 mx-auto"/>
          <p className="mt-1">Mine</p>
        </div>

        <div className="text-center text-[#85827d] w-1/5">
          <Friends className="w-8 h-8 mx-auto"/>
          <p className="mt-1">Friends</p>
        </div>

        <div className="text-center text-[#85827d] w-1/5">
          <Coins className="w-8 h-8 mx-auto"/>
          <p className="mt-1">Coins</p>
        </div>

        <div className="text-center text-[#85827d] w-1/5">
          <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Airdrop</p>
        </div>
      </div>

      {clicks.map((click) => ( // this func is for iterating over the clicks array, which dynamically generate a set of div elements
        <div //each div represents a click animation and is configured as follows
          key = {click.id} //provides a unique key for each element which helps 'React' identify, whcih items have changed, are added or are removed
          className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none" // absolute - positions the element absolutely relative to its nearest positioned ancestor (родитель) , pointer-events-none - disables mouse interactions with the elemeent
          style = {{ //this dynamically sets the position and animation style
            top: `${click.y -42}px`, //this positions the element vertically based on the 'y' coordinate of the click event '42 pixels' 
            left: `${click.x -28}px`, //this positions the element horizontally based on the 'x' coordinate of the click event '28 pixels'
            animation: `float 1s ease-out` //this applies the CSS animation, called 'float' , that lasts (длится) 1 sec. and eases out (и постепенно проходит)
          }}
          onAnimationEnd={() => handelAnimationEnd(click.id)} //this attaches (прикрепляет) an event handler to the 'animationEnd' event , which calls the ' handleAnimationEnd() ' function with the 'click.id' , when the animation ends
          >
            {pointsToAdd} {/* this displays the number of points , which added for each click inside the div */}
        </div>
      ))}

    </div>
  )
}

export default App
