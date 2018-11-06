/*！
 * @file Obloq/Obloq.ts
 * @brief DFRobot's obloq makecode library.
 * @n [Get the module here](http://www.dfrobot.com.cn/goods-1577.html)
 * @n Obloq is a serial port of WIFI connection module, Obloq can connect 
 *    to Microsoft Azure IoT and other standard MQTT protocol IoT.
 *
 * @copyright	[DFRobot](http://www.dfrobot.com), 2016
 * @copyright	GNU Lesser General Public License
 *
 * @author [email](xin.li@dfrobot.com)
 * @version  V1.0
 * @date  2018-03-20
 */



/**
 *Obloq implementation method.
 */
//% weight=10 color=#FFC0CB icon="\uf001" block="MP3"
namespace MP3 {

    export enum playType {
        //% block="Play"
        Play = 0x02,
        //% block="Pause"
        Pause = 0x03,
        //% block="Last"
        Last = 0x05,
        //% block="Next"
        Next = 0x06,
        //% block="Stop"
        Stop = 0x04
    }

    export enum cycleType {
        //% block="Single cycle"
        SingleCycle = 0x01,
        //% block="Single stop"
        SingleStop = 0x02,
        //% block="List cycle"
        ListCycle = 0x00,
        //% block="Shuffle"
        Shuffle = 0x03,
        //% block="Order"
        Order = 0x07
    }

    export enum equalizer {
        //% block="Normal"
        Normal = 0x00,
        //% block="Pop"
        Pop = 0x01,
        //% block="Rock"
        Rock = 0x02,
        //% block="Jazz"
        Jazz = 0x03,
        //% block="Classic"
        Classic = 0x04
    }



    /*function Obloq_wifi_icon_display(): void { 

    }*/


    /**
     * Disconnect the serial port.
     * @param rx to rx ,eg: SerialPin.P1
     * @param tx to tx ,eg: SerialPin.P2
    */
    //% weight=100
    //% rx.fieldEditor="gridpicker" rx.fieldOptions.columns=3
    //% tx.fieldEditor="gridpicker" tx.fieldOptions.columns=3
    //% blockId="MP3_pin_set"
    //% blockGap=20
    //% block="MP3 pin set | receive data(rx): %rx | send data(tx): %tx"
    //% blockExternalInputs=true
    export function MP3_pin_set(rx: SerialPin, tx: SerialPin): void {
        let item = ""
        serial.redirect(
            tx,
            rx,
            BaudRate.BaudRate9600
        )
        //First send data through usb, avoid the first data scrambled.
        item = serial.readString()
    } 

    /**
     * Disconnect the serial port.
     * @param type to type ,eg: playType.Play
    */
    //% weight=90
    //% type.fieldEditor="gridpicker" type.fieldOptions.columns=1
    //% blockId="MP3_play_control"
    //% blockGap=20
    //% block="MP3 play control %type"
    //% blockExternalInputs=true
    export function MP3_play_control(type: playType): void {
        let buffer = pins.createBuffer(4);
        buffer.setNumber(NumberFormat.UInt8BE, 0, 0xAA)
        buffer.setNumber(NumberFormat.UInt8BE, 1, type)
        buffer.setNumber(NumberFormat.UInt8BE, 2, 0x00)
        buffer.setNumber(NumberFormat.UInt8BE, 3, (0xAA + type + 0x00))
        serial.writeBuffer(buffer)
    } 

    /**
     * Disconnect the serial port.
     * @param num to num ,eg: 1
    */
    //% weight=80
    //% num.min=1 num.max=65535
    //% blockGap=20
    //% blockId="MP3_assign_song"
    //% block="MP3 play list %num"
    export function MP3_assign_song(num: number): void {
        num = num < 1 ? 1 : (num > 65535 ? 65535 : num)
        let buffer = pins.createBuffer(6);
        let num_h = (num>>8) & 0xFF
        let num_l = num & 0xFF

        buffer.setNumber(NumberFormat.UInt8BE, 0, 0xAA)
        buffer.setNumber(NumberFormat.UInt8BE, 1, 0x07)
        buffer.setNumber(NumberFormat.UInt8BE, 2, 0x02)
        buffer.setNumber(NumberFormat.UInt8BE, 3, num_h)
        buffer.setNumber(NumberFormat.UInt8BE, 4, num_l)
        buffer.setNumber(NumberFormat.UInt8BE, 5, (0xAA + 0x07 + 0x02 + num_h + num_l))
        serial.writeBuffer(buffer)
    } 

    /**
     * Disconnect the serial port.
     * @param type to type ,eg: cycleType.ListCycle
    */
    //% weight=70
    //% type.fieldEditor="gridpicker" type.fieldOptions.columns=1
    //% blockGap=20
    //% blockId="MP3_play_type"
    //% block="MP3 play type %type"
    export function MP3_play_type(type: cycleType): void {
        let buffer = pins.createBuffer(5);
        buffer.setNumber(NumberFormat.UInt8BE, 0, 0xAA)
        buffer.setNumber(NumberFormat.UInt8BE, 1, 0x18)
        buffer.setNumber(NumberFormat.UInt8BE, 2, 0x01)
        buffer.setNumber(NumberFormat.UInt8BE, 3, <number>type)
        buffer.setNumber(NumberFormat.UInt8BE, 4, <number>(0xAA + 0x18 + 0x01 + <number>type))
        serial.writeBuffer(buffer)
    } 

    /**
     * Disconnect the serial port.
     * @param vol to vol ,eg: 70
    */
    //% weight=60
    //% vol.min=0 vol.max=100
    //% blockGap=20
    //% blockId="MP3_volume_set"
    //% block="MP3 set volume %vol"
    export function MP3_volume_set(vol: number): void {
        vol = vol < 0 ? 0 : (vol > 100 ? 100 : vol)
        vol = (30 * vol) / 100

        let buffer = pins.createBuffer(5);
        buffer.setNumber(NumberFormat.UInt8BE, 0, 0xAA)
        buffer.setNumber(NumberFormat.UInt8BE, 1, 0x13)
        buffer.setNumber(NumberFormat.UInt8BE, 2, 0x01)
        buffer.setNumber(NumberFormat.UInt8BE, 3, <number>vol)
        buffer.setNumber(NumberFormat.UInt8BE, 4, <number>(0xAA + 0x13 + 0x01 + <number>vol))
        serial.writeBuffer(buffer)
    } 

    /**
     * Disconnect the serial port.
    */
    //% weight=50
    //% blockGap=20
    //% blockId="MP3_volume_up"
    //% block="MP3 volume +"
    export function MP3_volume_up(): void {
        let buffer = pins.createBuffer(4);
        buffer.setNumber(NumberFormat.UInt8BE, 0, 0xAA)
        buffer.setNumber(NumberFormat.UInt8BE, 1, 0x14)
        buffer.setNumber(NumberFormat.UInt8BE, 2, 0x00)
        buffer.setNumber(NumberFormat.UInt8BE, 3, 0xBE)
        serial.writeBuffer(buffer)
    } 

    /**
     * Disconnect the serial port.
    */
    //% weight=40
    //% blockGap=20
    //% blockId="MP3_volume_down"
    //% block="MP3 volume -"
    export function MP3_volume_down(): void {
        let buffer = pins.createBuffer(4);
        buffer.setNumber(NumberFormat.UInt8BE, 0, 0xAA)
        buffer.setNumber(NumberFormat.UInt8BE, 1, 0x15)
        buffer.setNumber(NumberFormat.UInt8BE, 2, 0x00)
        buffer.setNumber(NumberFormat.UInt8BE, 3, 0xBF)
        serial.writeBuffer(buffer)
    } 

    /**
     * Disconnect the serial port.
     * @param eq to eq ,eg: equalizer.Normal
    */
    //% weight=30
    //% eq.fieldEditor="gridpicker" eq.fieldOptions.columns=1
    //% blockGap=20
    //% blockId="MP3_eq_set"
    //% block="MP3 set equalizer %eq"
    export function MP3_eq_set(eq: equalizer): void {
        let buffer = pins.createBuffer(5);
        buffer.setNumber(NumberFormat.UInt8BE, 0, 0xAA)
        buffer.setNumber(NumberFormat.UInt8BE, 1, 0x1A)
        buffer.setNumber(NumberFormat.UInt8BE, 2, 0x01)
        buffer.setNumber(NumberFormat.UInt8BE, 3, <number>eq)
        buffer.setNumber(NumberFormat.UInt8BE, 4, <number>(0xAA + 0x1A + 0x01 + <number>eq))
        serial.writeBuffer(buffer)
    } 

}