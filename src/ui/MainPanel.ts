
import {UnitSelector} from "./UnitSelector";
import {SelectedUnitPanel} from "./SelectedUnitPanel";
import {OrderPanel} from "./OrderPanel";
import {Minimap} from "./Minimap";
import {Map} from "../ai/map/Map";
import {RecruitPanel} from "./RecruitPanel";
import {PlayerRepository} from "../game/player/PlayerRepository";
import {ItemRepository} from "../world/item/ItemRepository";
import {MenuPanel} from "./MenuPanel";

export class MainPanel
{
    private unitSelector: UnitSelector;
    private selectedUnitPanel: SelectedUnitPanel;
    private recruitPanel: RecruitPanel;
    private minimap: Minimap;

    constructor(group: Phaser.Group, panelWith: number, unitSelector: UnitSelector, players: PlayerRepository, map: Map, items: ItemRepository)
    {
        const screenWidth = group.game.width;
        this.unitSelector = unitSelector;

        this.minimap = new Minimap(group, panelWith, map, players, items);
        const background = group.game.add.sprite(screenWidth - panelWith, 0, 'CommandPanel', 0, group);
        background.z = 100;

        this.selectedUnitPanel = new SelectedUnitPanel(group, panelWith, unitSelector);
        this.recruitPanel = new RecruitPanel(group, players.human());
        new OrderPanel(group, screenWidth, panelWith, players.human());
        new MenuPanel(group, panelWith);
    }

    public update()
    {
        this.selectedUnitPanel.update();
        this.recruitPanel.update();
        this.minimap.update();
    }
}