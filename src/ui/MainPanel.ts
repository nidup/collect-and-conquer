
import {UnitSelector} from "./UnitSelector";
import {SelectedUnitPanel} from "./SelectedUnitPanel";
import {OrderPanel} from "./OrderPanel";
import {Minimap} from "./Minimap";
import {Map} from "../ai/map/Map";
import {RecruitPanel} from "./RecruitPanel";
import {PlayerRepository} from "../game/player/PlayerRepository";
import {ItemRepository} from "../world/item/ItemRepository";

export class MainPanel
{
    private game: Phaser.Game;
    private unitSelector: UnitSelector;
    private selectedUnitPanel: SelectedUnitPanel;
    private recruitPanel: RecruitPanel;
    private minimap: Minimap;

    constructor(game: Phaser.Game, panelWith: number, unitSelector: UnitSelector, players: PlayerRepository, map: Map, items: ItemRepository)
    {
        this.game = game;
        const screenWidth = this.game.width;
        this.unitSelector = unitSelector;

        this.minimap = new Minimap(game, panelWith, map, players, items);
        const background = game.add.sprite(screenWidth - panelWith, 0, 'CommandPanel', 0);
        background.z = 100;

        this.selectedUnitPanel = new SelectedUnitPanel(game, panelWith, unitSelector);
        this.recruitPanel = new RecruitPanel(this.game, players.human());
        new OrderPanel(game, screenWidth, panelWith, players.human());
    }

    public update()
    {
        this.selectedUnitPanel.update();
        this.recruitPanel.update();
        this.minimap.update();
    }
}