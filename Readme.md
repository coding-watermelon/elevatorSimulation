# Elevator Simulation
This project can be used to test different algorithms in order to improve elevator control logics. Try it out at [sittenstrolch.github.io/elevatorSimulation](https://sittenstrolch.github.io/elevatorSimulation/?elevatorCount=2&levelCount=4&peopleCount=100&speedFactor=10)!

![Screencast](https://raw.githubusercontent.com/Sittenstrolch/elevatorSimulation/master/media/comparison.gif)

## Benchmark
Imagine a building with **6 levels**, **4 elevators** and **500 people** using the elevator over the course of a day. With a [dumb logic](https://sittenstrolch.github.io/elevatorSimulation/?elevatorCount=4&levelCount=6&peopleCount=500&speedFactor=200&logic=random) (elevators stop where the last person got out), we measured an average waiting time of **27.6** seconds. With a [smarter logic](https://sittenstrolch.github.io/elevatorSimulation/?elevatorCount=4&levelCount=6&peopleCount=500&speedFactor=200&logic=smart) (elevators predict busy levels and move there if idle), the average waiting time dropped to **14.8** seconds!

## Customize
You can use these URL parameters to customize the simulator:

| Parameter      | Value |
| -------------- | -----:|
| elevatorCount  |     4 |
| levelCount     |     6 |
| peopleCount    |   100 |
| speedFactor    |    25 |
