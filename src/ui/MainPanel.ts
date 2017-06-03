
import {UnitSelector} from "./UnitSelector";
import {Player} from "../game/player/Player";
import {SelectedUnitPanel} from "./SelectedUnitPanel";
import {OrderPanel} from "./OrderPanel";
import {Minimap} from "./Minimap";
import {Map} from "../ai/map/Map";
import {RecruitPanel} from "./RecruitPanel";

export class MainPanel
{
    private game: Phaser.Game;
    private unitSelector: UnitSelector;
    private screenWidth: number;
    private selectedUnitPanel: SelectedUnitPanel;
    private recruitPanel: RecruitPanel;

    constructor(game: Phaser.Game, screenWidth: number, panelWith: number, unitSelector: UnitSelector, player: Player, map: Map)
    {
        this.game = game;
        this.screenWidth = screenWidth;
        this.unitSelector = unitSelector;

        new Minimap(game, panelWith, map);
        const background = game.add.sprite(screenWidth - panelWith, 0, 'CommandPanel', 0);
        background.z = 100;

        this.selectedUnitPanel = new SelectedUnitPanel(game, panelWith, unitSelector);
        this.recruitPanel = new RecruitPanel(this.game, player);
        new OrderPanel(game, screenWidth, panelWith, player);
    }

    public update()
    {
        this.selectedUnitPanel.update();
        this.recruitPanel.update();
    }
}