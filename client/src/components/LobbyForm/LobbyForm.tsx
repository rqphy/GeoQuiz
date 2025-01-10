import "./lobbyform.scss"
import CheckInput from "./CheckInput"
import continentsList from "../../data/FR/continents.json"
import { FormEvent, useState } from "react"
import Button from "../Button/Button"

interface ILobbyForm {
    onSubmit: (_event: FormEvent<HTMLFormElement>) => void
}

const defaultRoundLimit = 20 // gotta update server side too

export default function LobbyForm({ onSubmit }: ILobbyForm) {
    const [roundLimit, setRoundLimit] = useState<number>(defaultRoundLimit)
    const [checkAll, setCheckAll] = useState<boolean>(false)
    const [noneChecked, setNoneChecked] = useState<boolean>(true)
    const [isCopied, setIsCopied] = useState<boolean>(false)
    const [items, setItems] = useState(
        continentsList.map((continent) => ({
            ...continent,
            checked: false,
        }))
    )

    function updateRoundLimit(_event: any) {
        setRoundLimit(_event.target.value)
    }

    function updateNoneCheck(
        updatedItems: { checked: any; label: string; slug: string }[]
    ) {
        const someChecked = updatedItems.some((item) => item.checked)
        setNoneChecked(!someChecked)
    }

    function handleCheckAll(_event: any) {
        const { checked } = _event.target
        setCheckAll(checked)

        const updatedItems = items.map((item) => ({
            ...item,
            checked: checked,
        }))
        setItems(updatedItems)

        updateNoneCheck(updatedItems)
    }

    function handleItemChange(_event: any, slug: string) {
        const { checked } = _event.target
        const updatedItems = items.map((item) =>
            item.slug === slug ? { ...item, checked: checked } : item
        )
        setItems(updatedItems)

        const allChecked = updatedItems.every((item) => item.checked)
        setCheckAll(allChecked)

        updateNoneCheck(updatedItems)
    }

    function handleCopyLink(_event: any) {
        _event.preventDefault()
        setIsCopied(true)
        const currentUrl = window.location.href
        navigator.clipboard.writeText(currentUrl)

        setTimeout(() => {
            setIsCopied(false)
        }, 3000)
    }

    return (
        <form className="lobbyform" onSubmit={onSubmit}>
            <label className="lobbyform__option lobbyform--checkall">
                <input
                    type="checkbox"
                    id="checkall"
                    checked={checkAll}
                    onChange={handleCheckAll}
                />
                <div className="option__background"></div>

                <span>Monde</span>
            </label>
            {items.map((item) => (
                <CheckInput
                    key={item.slug}
                    label={item.label}
                    slug={item.slug}
                    checked={item.checked}
                    onChange={(_event: any) =>
                        handleItemChange(_event, item.slug)
                    }
                />
            ))}
            <label htmlFor="roundLimit">Nombre de manches : {roundLimit}</label>
            <input
                type="range"
                onChange={updateRoundLimit}
                id="roundLimit"
                name="roundLimit"
                min={5}
                max={40}
                step={5}
                value={roundLimit}
            />
            <div className="lobbyform__fastmode">
                <input type="checkbox" id="fastmode" name="fastmode" />
                <label htmlFor="fastmode">Mode rapide</label>
            </div>
            <Button label="Jouer" className={`${noneChecked && "disabled"}`} />
            <Button
                label={isCopied ? "Copié" : "Inviter"}
                className={`invite ${isCopied && "invite--copied"}`}
                onClick={handleCopyLink}
            />
        </form>
    )
}
