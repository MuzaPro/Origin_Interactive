# Ticket 7 - update the visual and text content of the state machine

## Visual content

New visual content has been rendered. We are switching back to the old naming convention

transition animation files are labeled by the state it start from and the state it ends on i.e "1to2.webm" is the transition that takes us from state 1 to state 2. 

we have rendered jpg files for static states 1,2 and 3. There's a temp png for state 4. 



The files we need to use now:



for static images:

assets\images\state1.jpg

assets\images\state2.jpg

assets\images\state3.jpg

assets\images\state4.png



for transition videos:

assets\animations\1to2.webm

assets\animations\2to3.webm

assets\animations\3to2.webm

assets\animations\1to3.webm

assets\animations\3to1.webm

assets\animations\2to1.webm



Currently missing transitions: all the transitions that lead to or from state 4. let's put the video paths in the code (i.e assets\animations\1to4.webm) but comment it out for the moment.



## Text content

The text is still a draft but it's easy to change often so let's use the new stuff.



### State 1: Server Room

Button label: Computation Source

Title: Resource State Generation

Text: To achieve a million qubit computation we would need to combine several units, each producing small clusters of qubits. Since this setup is modular, we can add as many units as needed to reach the desired computation scale.

[figure: photonic clusters are produced from several units and fused into a larger resource state.]

The photonic approach allows us to stitch (merge?) small clusters that were generated from separate sources, into a single entangled resource state.



### State 2: Single unit

Title: Introducing: ORIGIN

Text: the single unit is designed to be an efficient yet powerful resource state generator. The photonic approach allows the operation to take place at room temperature with relatively low overhead costs.

Notes: add the title “ORIGIN” next to the unit



### State 3: Photonic Chip

Button label: The Chip 

Title: Photonic Chip 

Text: Each vacuum chamber contains a cloud of Rb atoms. With the help of precise laser beams we can direct single atoms to a precise location on the photonic chip above. The chips are carved out of a silicon wafer, utilizing the well established production techniques that are already utilized in telecommunications.





### State 4: Cavity QED

Button label: Resonator Technology

Tile: Deterministic Generation + Entanglement

Text: with the help of cutting edge technology in the field of cavity Quantum Electro Dynamics we are able to efficiently produce photonic qubits at a close to perfect yield, as well as entanglement of all produced photons. 




