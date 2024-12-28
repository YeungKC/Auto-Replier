class SheetDB {
  constructor() {
    this.log = new Logger("SheetDB")
    this.spreadsheetName = CONFIG.REPLY_HISTORY_SHEET_ID
    this.ss = null

    try {
      const files = DriveApp.getFilesByName(this.spreadsheetName)
      if (files.hasNext()) {
        this.ss = SpreadsheetApp.open(files.next())
        this.log.info("Found existing spreadsheet")
      } else {
        this.log.info("Spreadsheet not found, creating new one")
        this.ss = SpreadsheetApp.create(this.spreadsheetName)
      }
      this.spreadsheetId = this.ss.getId()

      this.sheet = this.ss.getSheetByName("Replies")
      if (!this.sheet) {
        this.log.info("Sheet 'Replies' not found, creating new sheet")
        this.sheet = this.ss.getSheets()[0]
        this.sheet.setName("Replies")
        this.setupSheet()
      }
    } catch (error) {
      this.log.error("Failed to initialize SheetDB:", error)
      throw error
    }
  }

  setupSheet() {
    try {
      this.sheet.getRange("A1:C1").setValues([["Phone", "LastReply", "Count"]])
      this.sheet.setFrozenRows(1)

      this.sheet.setColumnWidth(1, 150)
      this.sheet.setColumnWidth(2, 180)
      this.sheet.setColumnWidth(3, 80)

      this.log.info("Sheet 'Replies' setup completed")
    } catch (error) {
      this.log.error("Failed to setup sheet:", error)
      throw error
    }
  }

  findRow(phone) {
    try {
      const data = this.sheet.getDataRange().getValues()
      const rowIndex = data.findIndex((row) => row[0] === phone)
      return rowIndex
    } catch (error) {
      this.log.error("Failed to find row for phone:", phone, error)
      throw error
    }
  }

  getProperty(phone) {
    try {
      const rowIndex = this.findRow(phone)
      if (rowIndex === -1) return null
      return this.sheet.getRange(rowIndex + 1, 2).getValue()
    } catch (error) {
      this.log.error("Failed to get property for phone:", phone, error)
      throw error
    }
  }

  setProperty(phone, timestamp) {
    try {
      const rowIndex = this.findRow(phone)
      if (rowIndex === -1) {
        this.sheet.appendRow([phone, timestamp, 1])
        this.log.info("Created new record for phone:", phone)
      } else {
        const row = rowIndex + 1
        const count = this.sheet.getRange(row, 3).getValue() + 1
        this.sheet.getRange(row, 2, 1, 2).setValues([[timestamp, count]])
        this.log.info("Updated record for phone:", phone, "count:", count)
      }
    } catch (error) {
      this.log.error("Failed to set property for phone:", phone, error)
      throw error
    }
  }
}
