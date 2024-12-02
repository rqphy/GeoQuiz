import { io, lobbies, roundDuration } from "./index.js"

export function resetScores(lobbyId) {
	lobbies[lobbyId].users.map((user) => {
		user.score = 0
	})
}

export function startNewRound(lobbyId, isNewRound) {
	if (isNewRound) {
		lobbies[lobbyId].round += 1
	}
	// Update values
	const roundCount = lobbies[lobbyId].round
	if (roundCount <= lobbies[lobbyId].roundLimit) {
		// Start new Round
		const gamemode = Math.random() > 0.5 ? "findCountry" : "findCapital"
		const countryId = generateRandomCountryId(
			lobbies[lobbyId].countriesList.length,
			lobbies[lobbyId].lastCountriesId
		)

		// reset round variables
		lobbies[lobbyId].playersWithGoodAnswer = []

		lobbies[lobbyId].lastCountriesId.push(countryId)

		const targetDate = new Date(new Date().getTime() + roundDuration * 1000)
		lobbies[lobbyId].targetDate = targetDate

		io.to(lobbyId).emit("startNewRound", {
			serverRoundCount: roundCount,
			countryId,
			gamemode,
			targetDate,
		})
	} else {
		// Game end
		io.to(lobbyId).emit("endGame")
	}
}

export function generateRandomCountryId(listLength, lastCountriesId) {
	let newCountryId

	do {
		newCountryId = Math.round(Math.random() * (listLength - 1))
	} while (lastCountriesId.includes(newCountryId))

	return newCountryId
}

export function handlePlayerLeavingLobby(lobbyId, playerId) {
	// Check if lobby exist
	if (lobbies[lobbyId]) {
		// Check if user is in it
		if (
			lobbies[lobbyId].users.filter((user) => user.uuid === playerId)
				.length > 0
		) {
			// Remove user
			lobbies[lobbyId].users = lobbies[lobbyId].users.filter(
				(user) => user.uuid !== playerId
			)
			console.log(`User ${playerId} has left the lobby: ${lobbyId}`)

			// Delete lobby if empty
			if (lobbies[lobbyId].users.length === 0) {
				console.log(`Lobby: ${lobbyId} was empty and got deleted`)
				delete lobbies[lobbyId]
				return
			}

			// Define new creator
			if (playerId === lobbies[lobbyId].creator) {
				// Get another user id
				const newCreator = lobbies[lobbyId].users[0].uuid
				console.log(
					`Lobby: ${lobbyId} has a new creator: ${newCreator}`
				)

				// Update room creator
				lobbies[lobbyId].creator = newCreator
				io.to(lobbyId).emit("updateCreator", newCreator)
			}

			// Update users list
			io.to(lobbyId).emit("updateUserList", lobbies[lobbyId].users)
		}
	}
}
