/**
 * Generates the yearly review from the yearSummary Array
 * @param {*} yearSummary : collected from SwiggyScrapper Hook
 */

function groupByYears(arr) {
  const yearObject = {};

  arr.forEach((order) => {
    const year = order.orderDate.year;

    if (yearObject[year]) {
  
      yearObject[year].push(order);
    } else {
  
      yearObject[year] = [order];
    }
  });

  let sortedKeys = Object.keys(yearObject).sort((a, b) => b.localeCompare(a));
  
  let sortedObject = {};
  sortedKeys.forEach((key) => {
    sortedObject[key] = yearObject[key];
  });

  return sortedObject;
}

function generateYearlyReview(yearSummary) {

  const totalOrders = yearSummary?.length;
  if(!totalOrders) return;

  
  const totalCost = yearSummary.reduce((acc, order) => {
    const cost = order.order_total
    return acc + cost;
  }, 0);


  
  const mostExpensiveOrder = yearSummary.reduce(
    (maxOrder, order) => {
      const cost = order.order_total;
      return cost > maxOrder.cost ? { order, cost } : maxOrder;
    },
    { order: null, cost: 0 }
  );

  
  const leastExpensiveOrder = yearSummary.reduce(
    (minOrder, order) => {
      const cost = order.order_total;
      return cost < minOrder.cost || minOrder.cost === 0
        ? { order, cost }
        : minOrder;
    },
    { order: null, cost: 0 }
  );

  
  const averageOrderCost = (totalCost / totalOrders).toFixed(2);

  
  const dishFrequency = yearSummary.reduce((acc, order) => {
    order.dishes.forEach((dish) => {
      if (!!dish && dish.trim() !== '' && dish != null)
        acc[dish] = (acc[dish] || 0) + 1;
    });
    return acc;
  }, {});

  const topDishes = Object.entries(dishFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));


  
  const restaurantFrequency = yearSummary.reduce((acc, order) => {
    const restaurantId = order.restaurant_name;
    acc[restaurantId] = (acc[restaurantId] || 0) + 1;
    return acc;
  }, {});
  
  const topRestaurants = Object.entries(restaurantFrequency).sort((a, b) => b[1] - a[1]).slice(0, 10);


  const uniqueRestaurants = new Set(
    yearSummary.map((order) => order.restaurant_name)
  ).size;


  const cityFrequency = yearSummary.reduce((acc, order) => {
    const cityName = order.restaurant_city_name;
    acc[cityName] = (acc[cityName] || 0) + 1;
    return acc;
  }, {});

  const topCities = Object.entries(cityFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)


  const allCities = Array.from(
    new Set(yearSummary.map((order) => order.restaurant_city_name))
  );



  const getTop10TimeSlots = (orderArray) => {
    const timeSlotCount = {};

    orderArray.forEach((order) => {
      const timeSlot = order.orderDate.timeSlot;
      timeSlotCount[timeSlot] = (timeSlotCount[timeSlot] || 0) + 1;
    });

    
    const timeSlotArray = Object.entries(timeSlotCount)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count);

    
    const top10TimeSlots = timeSlotArray.slice(0, 10);

    return top10TimeSlots;
  };

  const top10Time = getTop10TimeSlots(yearSummary);

  // Construct the analytics object
  const analytics = {
    total_orders: totalOrders,
    total_cost_spent: Number(totalCost.toFixed(2)),
    most_expensive_order: mostExpensiveOrder,
    least_expensive_order: leastExpensiveOrder,
    average_order_cost: averageOrderCost,
    top_dishes: topDishes,
    top_restaurants: topRestaurants,
    top_cities: topCities,
    all_cities: allCities,
    total_restaurants: uniqueRestaurants,
    top_10_time: top10Time,
  };

  console.log(analytics)

  return analytics;
}

function groupOrdersByMonth(yearSummary) {
  
  const monthlyOrders = Array.from({ length: 12 }, () => []);

 
  yearSummary.forEach((order) => {
    
    let month = order.orderDate.month - 1;
    

    
    monthlyOrders[month].push(order);
  });

  return monthlyOrders;
}

function readifyTimeSlot(hour) {
  if (hour < 0 || hour > 23) {
    return 'Invalid hour';
  }

  const isPM = hour >= 12;
  const ampmHour = hour % 12 || 12; // Convert 0 to 12 for midnight
  const nextHour = (hour + 1) % 12 || 12; // Calculate the next hour

  const timeString = `${ampmHour}:00 ${isPM ? 'PM' : 'AM'} - ${nextHour}:00 ${
    isPM && nextHour !== 12 ? 'PM' : 'AM'
  }`;

  return timeString;
}

export {
  groupOrdersByMonth,
  generateYearlyReview,
  groupByYears,
  readifyTimeSlot,
};

